# Nasazení na Forpsi

Web je statický export Next.js (`output: "export"`), takže na Forpsi hostingu
běží jako obyčejné HTML/CSS/JS soubory — žádný Node.js na serveru není potřeba.
Nahrazuje původní WordPress na `www.proplan-klima.cz`.

## Stav domény (zjištěno 27. 8. 2026)

| Co | Stav |
|---|---|
| DNS | `proplan-klima.cz` i `www` → `185.129.138.88`, NS Forpsi |
| Hosting | aktivní, běží na něm WordPress (Apache za `aruba-proxy`) |
| Přesměrování apex → www | řeší už proxy Forpsi (301) |
| **HTTPS** | **nefunguje** — na portu 443 je cizí certifikát `*.forpsi.org`, platnost skončila 24. 11. 2024 |

## 0. Nejdřív certifikát

Ve Forpsi administraci zapni pro doménu **Let's Encrypt** (u jejich hostingu
zdarma) pro `proplan-klima.cz` i `www.proplan-klima.cz`. Bez toho web poběží
jen na HTTP a prohlížeče označí kontaktní formulář jako nezabezpečený.

Až bude certifikát vydaný, odkomentuj v `public/.htaccess` blok „HTTPS“
a v `app/layout.tsx` už `metadataBase` na `https://` ukazuje.

## 1. Přihlašovací údaje

Do `.env.local` (necommituje se):

```
FORPSI_FTP_HOST=ftp.proplan-klima.cz
FORPSI_FTP_USER=...
FORPSI_FTP_PASSWORD=...
FORPSI_FTP_DIR=/www
```

Ověření spojení a výpis toho, co na hostingu je:

```bash
npm run deploy:check
```

Ověřeno 27. 8. 2026: server je `ftpx.forpsi.com`, login `www.proplan-klima.cz`
(hlavní FTP účet hostingu, ne dodatečný) a kořen webu je `/www`.
Vlastní zálohy Forpsi leží mimo něj v `/backups-forpsi` (denní + dvě týdenní),
takže je `--wipe` v `/www` nesmaže.

## 2. Záloha původního webu

```bash
npm run deploy:backup     # stáhne obsah /www do backups/forpsi-<datum>/
```

Databázi WordPressu tím nezazálohuješ — pokud ji chceš, exportuj ji zvlášť
z phpMyAdminu ve Forpsi administraci.

Záloha před prvním nasazením proběhla 27. 8. 2026: 3999 souborů / 127 MB
v `backups/forpsi-2026-08-27-14-26`. MySQL databáze WordPressu zůstala ve Forpsi
nedotčená.

## 3. Nasazení

```bash
npm run deploy                                     # build + nahrání přes původní soubory
node scripts/deploy-forpsi.mjs deploy --wipe       # smaže obsah /www a nahraje čistě
```

`--wipe` je u přechodu z WordPressu potřeba: jinak na serveru zůstane
`index.php`, `wp-admin/` a spol. a Apache může dál servírovat starý web.
Skript se před smazáním ptá; `--yes` potvrzení přeskočí.

## Co se nahrává

`out/` z `npm run build` — včetně `public/.htaccess`, který řeší:

- `DirectoryIndex index.html` (aby nevyhrál případný `index.php`)
- přesměrování `/kontakt` → `/kontakt/` (build běží s `trailingSlash: true`)
- `ErrorDocument 404 /404.html`
- cache: `/_next/static/*` natrvalo (má hash v názvu), HTML bez cache
- gzip a základní bezpečnostní hlavičky

## basePath

`next.config.ts` bere basePath z `NEXT_PUBLIC_BASE_PATH`:

- **Forpsi** — proměnná nenastavená → prázdný basePath, web běží v kořeni domény
- **GitHub Pages** — workflow nastavuje `/proplan-klima`

Nikdy tuhle proměnnou nedávej do commitnutého `.env`, rozbila by nasazení na Forpsi.

## Po nasazení zkontrolovat

- `/`, `/sluzby/`, `/o-nas/`, `/reference/`, `/kontakt/`, `/admin/`
- odeslání kontaktního formuláře (EmailJS + zápis do Supabase)
- přihlášení do `/admin`
- v Supabase → Authentication → URL Configuration doplnit `https://www.proplan-klima.cz`
