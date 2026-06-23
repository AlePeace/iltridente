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
