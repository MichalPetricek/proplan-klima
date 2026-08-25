-- Správa uživatelů přímo z administrace webu.
--
-- Web je statický export na GitHub Pages, nemá tedy žádný server, ze kterého
-- by šlo bezpečně volat Supabase Auth Admin API – secret key se do prohlížeče
-- vložit nesmí. Zakládání účtů proto obstarají databázové funkce se
-- `security definer`, které si samy ověří, že volající je v `admin_users`.
--
-- Účty se zakládají rovnou s potvrzeným e-mailem a heslem, bez odesílání
-- pošty: vestavěný SMTP Supabase doručuje jen členům týmu projektu a má nízké
-- limity, takže pozvánkový ani reset flow by v provozu nebyl spolehlivý.

create extension if not exists pgcrypto with schema extensions;

-- Přehled uživatelů pro administraci. auth.users není přes PostgREST dostupná,
-- proto ji zpřístupníme jen správcům a jen ve vybraných sloupcích.
create or replace function public.admin_list_users()
returns table (
  user_id uuid,
  email text,
  is_admin boolean,
  created_at timestamptz,
  last_sign_in_at timestamptz
)
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not (select public.is_admin()) then
    raise exception 'Přístup mají jen správci webu.' using errcode = '42501';
  end if;

  return query
    select
      u.id,
      u.email::text,
      (a.user_id is not null),
      u.created_at,
      u.last_sign_in_at
    from auth.users u
    left join public.admin_users a on a.user_id = u.id
    order by u.created_at;
end;
$$;

-- Založení účtu s heslem. Vkládáme i do auth.identities – bez toho by se
-- uživatel nepřihlásil heslem.
create or replace function public.admin_create_user(
  new_email text,
  new_password text,
  make_admin boolean default true
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_id uuid;
  clean_email text;
begin
  if not (select public.is_admin()) then
    raise exception 'Přístup mají jen správci webu.' using errcode = '42501';
  end if;

  clean_email := lower(trim(new_email));

  if clean_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$' then
    raise exception 'Zadejte platnou e-mailovou adresu.' using errcode = '22023';
  end if;

  if new_password is null or length(new_password) < 8 then
    raise exception 'Heslo musí mít alespoň 8 znaků.' using errcode = '22023';
  end if;

  if exists (select 1 from auth.users where lower(email) = clean_email) then
    raise exception 'Uživatel s e-mailem % už existuje.', clean_email
      using errcode = '23505';
  end if;

  new_id := gen_random_uuid();

  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    is_sso_user, is_anonymous
  )
  values (
    '00000000-0000-0000-0000-000000000000',
    new_id,
    'authenticated',
    'authenticated',
    clean_email,
    extensions.crypt(new_password, extensions.gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb,
    false, false
  );

  insert into auth.identities (
    provider_id, user_id, identity_data, provider,
    last_sign_in_at, created_at, updated_at
  )
  values (
    new_id::text,
    new_id,
    jsonb_build_object(
      'sub', new_id::text,
      'email', clean_email,
      'email_verified', true,
      'phone_verified', false
    ),
    'email',
    now(), now(), now()
  );

  if make_admin then
    insert into public.admin_users (user_id) values (new_id)
    on conflict (user_id) do nothing;
  end if;

  return new_id;
end;
$$;

-- Nastavení hesla jinému uživateli (vlastní heslo se mění přes Auth API).
create or replace function public.admin_set_password(
  target_user_id uuid,
  new_password text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not (select public.is_admin()) then
    raise exception 'Přístup mají jen správci webu.' using errcode = '42501';
  end if;

  if new_password is null or length(new_password) < 8 then
    raise exception 'Heslo musí mít alespoň 8 znaků.' using errcode = '22023';
  end if;

  if not exists (select 1 from auth.users where id = target_user_id) then
    raise exception 'Uživatel neexistuje.' using errcode = '02000';
  end if;

  update auth.users
  set encrypted_password = extensions.crypt(new_password, extensions.gen_salt('bf')),
      updated_at = now()
  where id = target_user_id;
end;
$$;

-- Udělení nebo odebrání práv správce.
create or replace function public.admin_set_role(
  target_user_id uuid,
  make_admin boolean
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not (select public.is_admin()) then
    raise exception 'Přístup mají jen správci webu.' using errcode = '42501';
  end if;

  if make_admin then
    if not exists (select 1 from auth.users where id = target_user_id) then
      raise exception 'Uživatel neexistuje.' using errcode = '02000';
    end if;
    insert into public.admin_users (user_id) values (target_user_id)
    on conflict (user_id) do nothing;
    return;
  end if;

  if target_user_id = (select auth.uid()) then
    raise exception 'Práva správce nelze odebrat sám sobě.' using errcode = '42501';
  end if;

  if (select count(*) from public.admin_users) <= 1 then
    raise exception 'Musí zůstat alespoň jeden správce.' using errcode = '42501';
  end if;

  delete from public.admin_users where user_id = target_user_id;
end;
$$;

-- Úplné smazání účtu. admin_users má na auth.users cascade, práva odejdou s ním.
create or replace function public.admin_delete_user(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not (select public.is_admin()) then
    raise exception 'Přístup mají jen správci webu.' using errcode = '42501';
  end if;

  if target_user_id = (select auth.uid()) then
    raise exception 'Vlastní účet nelze smazat.' using errcode = '42501';
  end if;

  if exists (select 1 from public.admin_users where user_id = target_user_id)
     and (select count(*) from public.admin_users) <= 1 then
    raise exception 'Musí zůstat alespoň jeden správce.' using errcode = '42501';
  end if;

  delete from auth.users where id = target_user_id;
end;
$$;

revoke all on function public.admin_list_users() from public, anon;
revoke all on function public.admin_create_user(text, text, boolean) from public, anon;
revoke all on function public.admin_set_password(uuid, text) from public, anon;
revoke all on function public.admin_set_role(uuid, boolean) from public, anon;
revoke all on function public.admin_delete_user(uuid) from public, anon;

grant execute on function public.admin_list_users() to authenticated;
grant execute on function public.admin_create_user(text, text, boolean) to authenticated;
grant execute on function public.admin_set_password(uuid, text) to authenticated;
grant execute on function public.admin_set_role(uuid, boolean) to authenticated;
grant execute on function public.admin_delete_user(uuid) to authenticated;

notify pgrst, 'reload schema';
