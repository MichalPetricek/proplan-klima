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

`ContactForm.tsx` je připraven pro připojení k backendu / e-mail službě
(Resend, Formspree, vlastní API route). Nyní simuluje odeslání.

## Design

- Barevná paleta odvozená přímo z loga (hnědá / béžová / krémová).
- Typografie: **Inter** (text) + **Cormorant Garamond** (display).
- Plynulé scroll-reveal animace, sticky navbar s blur efektem, responsivní layout.
