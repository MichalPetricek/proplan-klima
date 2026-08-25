# EmailJS šablona pro kontaktní formulář

## 1. Nastavení šablony

V EmailJS vytvořte službu a jednu e-mailovou šablonu. Do pole **To Email**
zadejte adresu, na kterou mají chodit poptávky, například
`info@proplan-klima.cz`.

**Subject**

```text
Nová poptávka z webu – {{service}} – {{from_name}}
```

**Reply-To**

```text
{{reply_to}}
```

**Content / HTML**

```html
<h2>Nová poptávka z webu Proplan Klima</h2>

<p><strong>Jméno:</strong> {{from_name}}</p>
<p><strong>E-mail:</strong> {{reply_to}}</p>
<p><strong>Telefon:</strong> {{phone}}</p>
<p><strong>Lokalita:</strong> {{location}}</p>
<p><strong>Služba:</strong> {{service}}</p>

<h3>Zpráva</h3>
<p style="white-space: pre-line">{{message}}</p>

<hr>
<p style="color: #6e5a47; font-size: 12px">
  Odesláno {{sent_at}} z kontaktního formuláře na webu Proplan Klima.
</p>
```

Používejte dvojité složené závorky. EmailJS obsah automaticky escapuje;
trojité závorky zde nejsou potřeba.

## 1b. Připojení schránky Forpsi (SMTP)

Forpsi není mezi předpřipravenými službami, v **Email Services → Select
Service** proto zvolte **SMTP Server** a vyplňte:

| Pole | Hodnota |
| --- | --- |
| SMTP server / Host | `smtp.forpsi.com` |
| Port | `465` (SSL) – funguje i `587` se STARTTLS |
| Secure / TLS | zapnuto |
| Username | **celá** e-mailová adresa, např. `info@proplan-klima.cz` |
| Password | heslo ke schránce |

Server na obou portech nabízí `AUTH LOGIN PLAIN`, ověřeno spojením.

**Doporučení:** založte u Forpsi samostatnou schránku jen pro web (např.
`web@proplan-klima.cz`) a použijte ji tady. Heslo se ukládá u EmailJS, takže
případný únik se pak netýká hlavní firemní schránky.

### Odesílatel v šabloně

Do **From Email** patří vždy adresa z vlastní domény, kterou se SMTP
autentizuje – nikdy e-mail poptávajícího. Jinak zpráva neprojde kontrolou SPF
a skončí ve spamu, případně ji Forpsi rovnou odmítne. Adresa odesílatele se
řeší přes **Reply-To**:

| Pole šablony | Hodnota |
| --- | --- |
| To Email | `info@proplan-klima.cz` |
| From Name | `Poptávka z webu – {{from_name}}` |
| From Email | `info@proplan-klima.cz` (nebo `web@…`) |
| Reply-To | `{{reply_to}}` |

Odpověď na doručenou poptávku pak jde rovnou zákazníkovi.

### Limity

Forpsi zvládne 1000 zpráv za hodinu, přísnější je tedy free plán EmailJS –
200 e-mailů měsíčně. Poptávky se navíc vždy ukládají do administrace, takže
ani po vyčerpání limitu o žádnou nepřijdete.

## 2. Proměnné prostředí

Hodnoty patří do **`.env`** (ne do `.env.local`) – jsou to `NEXT_PUBLIC_`
proměnné a build na GitHub Pages je čte právě odtud:

```text
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=...
NEXT_PUBLIC_EMAILJS_SERVICE_ID=...
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=...
```

Veřejný EmailJS klíč je určený pro kód v prohlížeči. Privátní klíč se do webu
nevkládá. Po změně proměnných je potřeba web znovu sestavit a nasadit – u
GitHub Pages stačí push do `main`.

V EmailJS ještě v **Account → Security** povolte doménu, ze které se formulář
odesílá (`michalpetricek.github.io`, případně ostrou doménu webu).

## 3. Když odeslání selže

Formulář nejdřív uloží poptávku do Supabase a teprve potom volá EmailJS.
Když je EmailJS nedostupný, vyčerpá měsíční limit nebo ještě není
nakonfigurovaný, poptávka se neztratí – zůstane v administraci v sekci
**Poptávky**. Chybovou hlášku návštěvník uvidí jen tehdy, když selžou oba
kanály.

Praktický důsledek: dokud nejsou EmailJS proměnné vyplněné, formulář funguje,
ale poptávky chodí pouze do administrace, ne na e-mail.

## 4. Ochrana formuláře

Formulář má honeypot, blokování headless klientů a desetisekundový limit mezi
odesláními v jednom prohlížeči. Před ostrým provozem doporučujeme v EmailJS
nastavit také seznam povolených domén. Pokud se objem poptávek zvýší, přesuneme
odesílání do Supabase Edge Function s CAPTCHA a serverovým rate limitem.
