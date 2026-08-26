# CLAUDE.md

Guida per lavorare su questo repository. Il sito è **Il Tridente Positano** —
sito di un ristorante/bar, multilingua (IT/EN), costruito con un'architettura
**headless WordPress + Next.js**.

## Stack

- **Next.js 16** (App Router) + **React 19**
- **next-intl 4** — i18n con routing `[locale]` (locali: `it`, `en`)
- **WordPress headless** via **WPGraphQL** — il contenuto arriva come "blocchi"
  Gutenberg e viene renderizzato dinamicamente
- **Tailwind CSS 4** (`@tailwindcss/postcss`)
- **GSAP 3** (`@gsap/react`) — animazioni puntuali (no SplitText, no ScrollTrigger reveal)
- **Lenis** — smooth scroll
- **Swiper** — caroselli
- **nodemailer** — invio email dai form
- **next/font/google** — `Nunito_Sans` (`--font-nunito`) e `Cinzel` (`--font-cinzel`)

## Comandi

```bash
npm run dev      # sviluppo locale
npm run build    # build di produzione
npm run start    # server di produzione
npm run lint     # eslint (next lint)
```

## Variabili d'ambiente (`.env`)

| Variabile | Uso |
|-----------|-----|
| `WP_GRAPHQL_URL` | Endpoint WPGraphQL (fetch pagine/menu) |
| `NEXT_PUBLIC_WP_URL` | URL base WordPress (riscrittura link/URL) |
| `NEXT_PUBLIC_SITE_URL` | URL pubblico del sito (sitemap, SEO) — default `https://iltridentepositano.com` |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` / `SMTP_USER` / `SMTP_PASS` | Invio email (nodemailer) |
| `CONTACT_EMAIL` / `WAITLIST_EMAIL` | Destinatari form contatti / waitlist |

## Architettura — come funziona il rendering

Il cuore del sito è il pattern **headless WP → blocchi → componenti React**:

1. **Routing**: `app/[locale]/page.jsx` (home) e `app/[locale]/[...slug]/page.jsx`
   (tutte le altre pagine) ricevono l'`uri` e il `locale`.
2. **Fetch dati**: `utils/getPage.js` interroga WPGraphQL (`nodeByUri`), gestisce
   le traduzioni (fallback alla lingua disponibile) e ritorna `{ blocks, alternates }`.
   Usa ISR: `next: { revalidate: 86400 }`.
3. **Trasformazione**: `utils/cleanAndTransformBlocks.js` normalizza i blocchi
   Gutenberg (e rimuove l'URL di WordPress dagli HTML via `NEXT_PUBLIC_WP_URL`).
4. **Rendering**: `components/BlockRenderer/BlockRenderer.jsx` è uno **switch** che
   mappa ogni blocco (`core/group` con un `metadata.name`/`className`, oppure
   `core/heading`, `core/image`, ecc.) al componente React corrispondente.

> Per aggiungere una nuova sezione: si crea un `core/group` in WordPress con un
> nome (`metadata.name`), si aggiunge un `case` in `BlockRenderer` e si crea il
> componente in `components/<Nome>/`.

### Utils principali (`utils/`)

- `getPage.js` — fetch + traduzioni di una pagina
- `getAllPages.js` — elenco pagine (sitemap / static params)
- `getMenu.js` — menu di navigazione
- `getSeo.js` — metadati SEO / OpenGraph
- `getHeaderLogo.js`, `getBlockLink.js`, `relativeToAbsoluteUrls.js`,
  `cleanAndTransformBlocks.js` — helper di trasformazione

### API routes (`app/api/`)

- `contact/route.js` — gestione form (contatti, prenotazioni, waitlist) via nodemailer
- `revalidate/route.js` — revalidation on-demand (webhook da WordPress)

## Convenzioni

- **Componenti**: un componente per cartella in `components/<Nome>/<Nome>.jsx`,
  esportato con **named export** (`export const Nome = ...`), spesso con un
  `index.js` di re-export. I componenti ricevono i dati come prop `blocks`
  (il blocco Gutenberg grezzo) ed estraggono `innerBlocks`/`attributes`.
- **Import**: assoluti dalla root (`components/...`, `utils/...`, `context/...`).
- **Immagini**: si usa **sempre `next/image`** con `width`/`height` (presi dagli
  `attributes` di WordPress, con fallback). Gli hero hanno `priority` +
  `fetchPriority="high"`. Non usare mai `<img>` raw.
- **Animazioni GSAP**: usare `useGSAP` (`@gsap/react`) con `scope` per il cleanup
  automatico. Le animazioni sono leggere e basate su `opacity`/`transform`.
- **Smooth scroll**: gestito globalmente da `components/SmoothScroll` (Lenis +
  integrazione `ScrollTrigger`). Fa `ScrollTrigger.refresh()` sui cambi di route.
  Elementi che NON devono avere lo smooth scroll usano `data-lenis-prevent`.
- **i18n**: testi UI in `messages/it.json` e `messages/en.json`; routing in
  `i18n/routing.js`, navigazione in `i18n/navigation.js`.
- **Contesto**: `context/AlternatesContext` espone gli URL alternati (hreflang)
  per il `LanguageSwitcher`.

## Note / Insidie

- Il rendering dipende interamente dalla struttura dei blocchi in WordPress: se
  un blocco non ha il `metadata.name` atteso, `BlockRenderer` non lo renderizza.
- In `BlockRenderer` e `getPage` ci sono `console.log` di debug ancora attivi.
- `getPage` ritorna `null` se WordPress non risponde: le pagine devono gestire
  il caso (evitare crash in build su Vercel — vedi cronologia commit).
- Performance/CLS: vedi `CLS_AND_ANIMATION_FIXES.md` per la checklist di riferimento.
  Il sito già rispetta i punti principali (next/image ovunque, `priority` sugli
  hero, nessun SplitText).

## Deliverability email — indagine del 25/08/2026

### Il problema

Le conferme automatiche della waitlist (`app/api/contact/route.js`, `formType
=== "waitlist"`) venivano **rifiutate da iCloud/Apple** con errore permanente:

```
554 5.7.1 [CS01] Message rejected due to local policy
```

Non filtraggio in Junk: rifiuto secco a livello SMTP, dopo `end of data`.

### Diagnosi finale

**È il dominio `iltridentepositano.com` presente nei link del corpo.** Apple lo
ha marcato nella propria reputazione interna degli URL. Il blocco vale per il
**dominio registrato**, quindi copre anche i sottodomini, indipendentemente
dall'hosting.

Isolato con 8 test controllati: stesso mittente, stesso IP, stesso contenuto,
variando **solo** il link.

| Variabile | Verdetto |
|---|---|
| IP di invio SiteGround (PTR generico `googleusercontent.com`) | innocente |
| Contenuto, testo promozionale, template grafico | innocente |
| Link a terze parti (L'Onda, EdEra, Poesea) | innocenti |
| Hosting Vercel | innocente |
| **Link a `iltridentepositano.com`** | **causa del blocco** |

Esiti: nessun link ✅ · `wikipedia.org` ✅ · `ederapositano.com` ✅ ·
`iltridentepositano.com` ❌ 3/3 · `www.` ❌ · `test.` su SiteGround ❌

Non serve a nulla: migrare a Resend/Postmark (il problema viaggia col dominio
linkato, non con l'IP), cambiare hosting, riscrivere il testo.

**Test 9 (26/08/2026)** — mittente completamente estraneo all'infrastruttura
del ristorante: da `alesparano@gmail.com` (Gmail, non SiteGround) a un
indirizzo iCloud, corpo in **solo testo semplice** (nessun tag `<a>`, nessun
HTML) contenente unicamente la stringa nuda `iltridentepositano.com`. Esito:
**bloccato**. Questo esclude ogni residua variabile legata a IP mittente,
SPF/DKIM/DMARC del dominio, formattazione HTML o tag di link — Apple blocca
sulla base della sola **stringa/dominio testuale** presente nel corpo,
indipendentemente da come viene veicolata. Rende la causa "reputazione URL
proprietaria Apple sul dominio" pressoché certa.

### Stato DNS verificato

- **SPF** valido — `include:_spf.mailspamprotection.com`
- **DKIM** valido — selettore `default`, chiave RSA presente
- **DMARC** — `p=quarantine; aspf=r; adkim=r; rua=mailto:dmarc@iltridentepositano.com`
  (il `rua` è stato aggiunto il 25/08/2026; verificare che la casella esista)
- Blocklist pubbliche (Spamhaus DBL, SURBL, URIBL): **tutte pulite**
- Wayback: dominio attivo dal 2018, sempre lo stesso sito, nessun passaggio di
  proprietà sospetto

`WAITLIST_EMAIL` = `team@iltridentepositano.com` — stesso dominio del `d=` DKIM,
allineamento DMARC corretto. Il dominio nel `From` **non** è un problema: tutti
i test andati a buon fine partivano da quell'indirizzo.

### Fix già applicati a `route.js` (commit 77ab985, c94e0c3)

Migliorie corrette e utili, ma **non risolutive** del blocco Apple:

- parte `text/plain` su tutte le email (prima erano HTML-only, forte segnale spam)
- tutti i link in HTTPS (erano `http://` Poesea e Instagram)
- header `List-Unsubscribe`
- rimosso `tls.rejectUnauthorized: false`
- `logDelivery()` — logga `accepted`/`rejected`/`response` di ogni invio
- **righe pre-mandate a capo sotto i 76 caratteri e ogni URL isolato**: il
  quoted-printable spezzava gli URL a metà (`https://www.=\ninstagram.com/...`),
  che i filtri leggono come offuscamento. Il testo esce ora come `7bit`.
  L'helper `a(href, label)` in `buildWaitlistConfirm` emette gli anchor con
  `href` su riga propria. **Non allungare quelle righe.**

Punteggio mail-tester dopo i fix: **10/10** (che però non dice nulla su Apple —
`[CS01]` è policy proprietaria, non SpamAssassin).

### Cosa resta da fare

1. **Tampone**: togliere dal corpo della conferma waitlist le due occorrenze di
   `iltridentepositano.com` (link "here" + riga footer). Va rimossa **la stringa
   del dominio**, non solo l'`<a>`: gli scanner estraggono URL anche dal testo.
   Richiede l'ok della cliente.
2. **Segnalazione ad Apple** — unica via di delisting, tempi non garantiti.
3. **Leggere i report DMARC** (dmarcian o Postmark, piano free) per capire se il
   dominio è spoofato. Limite noto: DMARC vede solo lo spoofing del `From`, non
   chi mette link al sito dentro il proprio spam.

### Insidie da ricordare

- Il rate limit in `route.js` è **1 invio al minuto per IP**: durante i test un
  429 non è un problema di deliverability.
- Non comporre email di test dalla webmail Roundcube senza la vista sorgente:
  riscrive l'HTML e invalida il test.
- La notifica interna a `team@` resta dentro SiteGround e non attraversa mai
  iCloud: un `250 OK` lì non dimostra nulla sulla consegna al cliente.
