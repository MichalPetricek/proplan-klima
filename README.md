# Proplan Klima — webové stránky

Moderní firemní web pro **Proplan Klima** (projekce, klimatizace, vzduchotechnika,
tepelná čerpadla). Postavený v **Next.js 16 (App Router) + Tailwind CSS 4 + TypeScript**.

## Vývoj

```bash
npm install
npm run dev
```

Aplikace běží na <http://localhost:3000>.

## Build

```bash
npm run build
npm start
```

## Struktura

```
app/
  layout.tsx          # globální layout + fonty + navbar/footer
  page.tsx            # úvodní stránka
  sluzby/             # přehled služeb
  o-nas/              # o firmě
  reference/          # vybrané realizace
  kontakt/            # kontakty + formulář
components/
  Navbar.tsx, Footer.tsx, CTASection.tsx, ContactForm.tsx, ScrollReveal.tsx,
  icons.tsx, services-data.tsx
public/
  logo.svg            # plné logo (text + dům)
  logo-mark.svg       # samotná značka
```

## Logo

V `public/` jsou aktuálně **vektorové verze loga**, vytvořené podle zaslaného
obrázku, aby se na webu škálovaly ostře v každém rozlišení. Pokud máš
originál v PNG/SVG, stačí přepsat soubory `public/logo.svg` a
`public/logo-mark.svg`.

## Obsah

Texty (claim *„Originální řešení pro Vaši nemovitost.“*, sekce *O nás*,
kontakty) jsou převzaté z aktuálního webu <http://www.proplan-klima.cz/>
a rozšířené o detailní popisy služeb v duchu firmy. Kontakty:

- **info@proplan-klima.cz**
- **+420 737 830 599**
- Trávnická 787, Hranice I-Město, 753 01

## Formulář

Kontaktní formulář odesílá přes EmailJS a ukládá kopii poptávky do Supabase.
Přesná šablona a nastavení jsou v `docs/emailjs-template.md`.

## Administrace a Supabase

Administrace kontaktů a referencí je dostupná na `/admin`. Databázové tabulky,
RLS pravidla a Storage bucket vytváří migrace v `supabase/migrations/`.
Postup prvního zapojení je v `docs/supabase-setup.md`.

```bash
npm run supabase:check                       # stav tabulek a bucketu
npm run supabase:admin create vas@email.cz   # založí správce pro /admin
```

Veřejné proměnné (`NEXT_PUBLIC_SUPABASE_URL`, publishable key) jsou v
commitnutém `.env` – build z něj čte, protože workflow žádné secrets nepředává.
Secret key patří jen do `.env.local`, který se necommituje.

## Nasazení

Ostrý web běží na Forpsi hostingu (`www.proplan-klima.cz`) jako statický export
nahraný přes FTP. Postup, zálohu původního WordPressu a poznámku k certifikátu
popisuje `docs/forpsi-deploy.md`.

```bash
npm run deploy:check    # ověří FTP připojení
npm run deploy:backup   # záloha stávajícího obsahu /www
npm run deploy          # build + nahrání
```

GitHub Pages zůstává jako náhled – workflow si tam sám nastavuje
`NEXT_PUBLIC_BASE_PATH=/proplan-klima`. Bez téhle proměnné se web builduje do
kořene domény, což je varianta pro Forpsi.

## Design

- Barevná paleta odvozená přímo z loga (hnědá / béžová / krémová).
- Typografie: **Inter** (text) + **Cormorant Garamond** (display).
- Plynulé scroll-reveal animace, sticky navbar s blur efektem, responsivní layout.
