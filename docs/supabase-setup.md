# Zprovoznění Supabase administrace

## 1. Projekt a databáze

1. Vytvořte projekt v Supabase.
2. V **SQL Editoru** spusťte celý soubor
   `supabase/migrations/20260821000100_initial_cms.sql`.
3. Migrace vytvoří tabulky, RLS pravidla, výchozí obsah a veřejný Storage bucket
   `reference-images`.

Migrace je idempotentní – jde ji pustit opakovaně (například po úpravě
pravidel), aniž by spadla na už existujících objektech.

Stav databáze kdykoli ověříte příkazem:

```bash
npm run supabase:check
```

Vypíše, které tabulky a bucket existují, a pokud něco chybí, rovnou nabídne
odkaz do SQL editoru daného projektu.

## 2. Připojení webu

Proměnné jsou rozdělené podle toho, co smí do prohlížeče:

| Soubor | Obsah | Verzuje se |
| --- | --- | --- |
| `.env` | `NEXT_PUBLIC_*` – URL projektu, publishable key, EmailJS | **ano**, build na GitHub Pages z něj čte |
| `.env.local` | `SUPABASE_SECRET_KEY` | ne, je v `.gitignore` |

`NEXT_PUBLIC_*` hodnoty jsou součástí JS bundlu, takže jsou veřejné už z
principu – u publishable key je to v pořádku, data chrání RLS pravidla.
Secret key obchází RLS, patří výhradně do `.env.local` a čte ho jen skript
`scripts/supabase-admin.mjs`, nikdy ne web.

Bez commitnutého `.env` by nasazený web na GitHub Pages neměl kam se připojit –
workflow žádné secrets nepředává a stránky by se vykreslily s výchozím obsahem
ze `lib/cms.ts`.

## 3. Administrátoři

Pouhé přihlášení nestačí – uživatel musí být v tabulce `admin_users`, tuto
kontrolu vynucují databázová RLS pravidla. Správu obstará skript:

```bash
npm run supabase:admin create vas@email.cz          # vytvoří účet, heslo vypíše
npm run supabase:admin create vas@email.cz Heslo123 # vlastní heslo
npm run supabase:admin list                         # kdo je správce
npm run supabase:admin revoke vas@email.cz          # odebere práva
```

`create` funguje i pro už existující účet – jen ho doplní mezi správce.
Veřejnou registraci uživatelů doporučujeme v nastavení Auth vypnout.

Po přihlášení na `/admin` se kontakty propisují do navigace, patičky a
kontaktní stránky. Publikované reference se zobrazují na úvodu i na stránce
Reference.

## 4. Co se stane bez Supabase

Web je stavěný tak, aby fungoval i při nedostupné databázi: komponenty startují
s výchozím obsahem z `lib/cms.ts` a Supabase data jen přepíšou. Chybějící
konfigurace proto neshodí veřejné stránky, jen `/admin` zobrazí výzvu k
doplnění proměnných.
