-- PROPLAN Klima: první verze CMS, administrace a evidence poptávek.
-- Spusťte v Supabase SQL Editoru, případně přes Supabase CLI migrations.

create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
revoke all on table public.admin_users from anon, authenticated;
-- service_role (secret key) spravuje administrátory ze skriptu scripts/supabase-admin.mjs.
grant select, insert, delete on table public.admin_users to service_role;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create table if not exists public.site_contacts (
  id text primary key default 'main' check (id = 'main'),
  company_name text not null,
  email text not null,
  phone_display text not null,
  phone_href text not null,
  office_address text not null,
  registered_address text not null,
  opening_hours_weekdays text not null,
  opening_hours_weekend text not null,
  map_embed_url text not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.references (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 160),
  category text not null check (char_length(category) between 1 and 100),
  description text not null check (char_length(description) between 1 and 2000),
  image_url text not null,
  image_path text,
  alt text not null default '',
  size text not null default 'standard' check (size in ('wide', 'standard')),
  featured boolean not null default false,
  published boolean not null default true,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists references_public_order_idx
  on public.references (published, sort_order);

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  from_name text not null check (char_length(from_name) between 1 and 160),
  reply_to text not null check (char_length(reply_to) between 3 and 320),
  phone text not null default '' check (char_length(phone) <= 80),
  location text not null default '' check (char_length(location) <= 300),
  service text not null default '' check (char_length(service) <= 160),
  message text not null check (char_length(message) between 1 and 5000),
  handled boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.site_contacts enable row level security;
alter table public.references enable row level security;
alter table public.contact_submissions enable row level security;

-- Supabase dává rolím anon/authenticated přes default privileges plná práva
-- na nové tabulky v public. Nejdřív je odebereme, ať jsou práva níže přesná
-- a data nechrání jen RLS, ale i samotné granty.
revoke all on table public.site_contacts from anon, authenticated;
revoke all on table public.references from anon, authenticated;
revoke all on table public.contact_submissions from anon, authenticated;

grant select on public.site_contacts to anon, authenticated;
grant insert, update on public.site_contacts to authenticated;

grant select on public.references to anon, authenticated;
grant insert, update, delete on public.references to authenticated;

grant insert on public.contact_submissions to anon, authenticated;
grant select, update, delete on public.contact_submissions to authenticated;

drop policy if exists "Kontakty jsou veřejně čitelné" on public.site_contacts;
create policy "Kontakty jsou veřejně čitelné"
on public.site_contacts for select
to anon, authenticated
using (true);

drop policy if exists "Administrátor může vložit kontakty" on public.site_contacts;
create policy "Administrátor může vložit kontakty"
on public.site_contacts for insert
to authenticated
with check ((select public.is_admin()));

drop policy if exists "Administrátor může upravit kontakty" on public.site_contacts;
create policy "Administrátor může upravit kontakty"
on public.site_contacts for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Publikované reference jsou veřejně čitelné" on public.references;
create policy "Publikované reference jsou veřejně čitelné"
on public.references for select
to anon, authenticated
using (published = true);

drop policy if exists "Administrátor může číst všechny reference" on public.references;
create policy "Administrátor může číst všechny reference"
on public.references for select
to authenticated
using ((select public.is_admin()));

drop policy if exists "Administrátor může vložit reference" on public.references;
create policy "Administrátor může vložit reference"
on public.references for insert
to authenticated
with check ((select public.is_admin()));

drop policy if exists "Administrátor může upravit reference" on public.references;
create policy "Administrátor může upravit reference"
on public.references for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Administrátor může smazat reference" on public.references;
create policy "Administrátor může smazat reference"
on public.references for delete
to authenticated
using ((select public.is_admin()));

drop policy if exists "Veřejnost může odeslat poptávku" on public.contact_submissions;
create policy "Veřejnost může odeslat poptávku"
on public.contact_submissions for insert
to anon, authenticated
with check (
  char_length(from_name) between 1 and 160
  and char_length(reply_to) between 3 and 320
  and char_length(message) between 1 and 5000
);

drop policy if exists "Administrátor může číst poptávky" on public.contact_submissions;
create policy "Administrátor může číst poptávky"
on public.contact_submissions for select
to authenticated
using ((select public.is_admin()));

drop policy if exists "Administrátor může upravit poptávky" on public.contact_submissions;
create policy "Administrátor může upravit poptávky"
on public.contact_submissions for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Administrátor může smazat poptávky" on public.contact_submissions;
create policy "Administrátor může smazat poptávky"
on public.contact_submissions for delete
to authenticated
using ((select public.is_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'reference-images',
  'reference-images',
  true,
  6291456,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Administrátor může nahrávat fotografie referencí" on storage.objects;
create policy "Administrátor může nahrávat fotografie referencí"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'reference-images'
  and (select public.is_admin())
);

drop policy if exists "Administrátor může upravit fotografie referencí" on storage.objects;
create policy "Administrátor může upravit fotografie referencí"
on storage.objects for update
to authenticated
using (
  bucket_id = 'reference-images'
  and (select public.is_admin())
)
with check (
  bucket_id = 'reference-images'
  and (select public.is_admin())
);

drop policy if exists "Administrátor může smazat fotografie referencí" on storage.objects;
create policy "Administrátor může smazat fotografie referencí"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'reference-images'
  and (select public.is_admin())
);

insert into public.site_contacts (
  id, company_name, email, phone_display, phone_href, office_address,
  registered_address, opening_hours_weekdays, opening_hours_weekend, map_embed_url
)
values (
  'main',
  'PROPLAN Klima s.r.o.',
  'info@proplan-klima.cz',
  '+420 737 830 599',
  '+420737830599',
  E'Hranická 107\n753 61 Hranice IV-Drahotuše',
  E'Trávnická 787\n753 01 Hranice',
  '7:00–15:30',
  'zavřeno',
  'https://www.google.com/maps?q=Hranick%C3%A1+107,+753+61+Hranice+IV-Drahotu%C5%A1e&output=embed'
)
on conflict (id) do nothing;

insert into public.references (
  id, title, category, description, image_url, alt, size, featured, published, sort_order
)
values
  (
    '00000000-0000-4000-8000-000000000001',
    'Venkovní VZT jednotka',
    'Vzduchotechnika',
    'Rozsáhlé venkovní řešení vzduchotechniky pro průmyslový objekt. Důraz na funkční vedení tras, servisní přístup a čisté napojení technologie.',
    '/projects/industrial-air-handling.jpg',
    'Venkovní vzduchotechnická jednotka u průmyslového objektu',
    'wide', true, true, 10
  ),
  (
    '00000000-0000-4000-8000-000000000002',
    'Kaskádová kotelna Buderus',
    'Vytápění',
    'Kaskádové zapojení kotlů s navazujícími rozvody a regulací. Technické řešení připravené s ohledem na spolehlivost i budoucí servis.',
    '/projects/boiler-room-detail.jpg',
    'Detail technologické kotelny se třemi kotli Buderus',
    'standard', true, true, 20
  ),
  (
    '00000000-0000-4000-8000-000000000003',
    'Technická místnost',
    'Zdroj tepla',
    'Kompletní technologie zdroje tepla včetně akumulace, čerpadlových skupin a přehledně vedených rozvodů.',
    '/projects/boiler-room.jpg',
    'Technická místnost s kotli Buderus, zásobníkem a rozvody',
    'standard', false, true, 30
  )
on conflict (id) do nothing;

-- Automatické updated_at, aby razítko nezáviselo na tom, co pošle prohlížeč.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_contacts_set_updated_at on public.site_contacts;
create trigger site_contacts_set_updated_at
before update on public.site_contacts
for each row execute function public.set_updated_at();

drop trigger if exists references_set_updated_at on public.references;
create trigger references_set_updated_at
before update on public.references
for each row execute function public.set_updated_at();

-- PostgREST si po DDL musí načíst nové schéma, jinak vrací PGRST205.
notify pgrst, 'reload schema';
