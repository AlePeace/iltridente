# Fix da implementare — siti headless Next.js + WPGraphQL

## Contesto
Errori ricorrenti su `villasantasofia.it` e `iltridentepositano.com` causati da instabilità
momentanea del backend SiteGround (biagioc21.sg-host.com), che in certi momenti restituisce
HTML invece di JSON, va in timeout, o restituisce dati incompleti.

---

## Fix 1 — Error handling sul fetch GraphQL (entrambi i siti)

**Problema:** Quando SiteGround restituisce HTML invece di JSON (errore 500, redirect, ecc.),
`JSON.parse()` crasha con `SyntaxError: Unexpected token '<'`.

**Dove intervenire:** In tutte le funzioni/utility che fanno fetch verso l'endpoint GraphQL
(di solito in `lib/api.js` o simile).

**Implementazione:**
```js
const res = await fetch(process.env.WORDPRESS_API_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query }),
});

// Controlla che la risposta sia JSON prima di parsare
const contentType = res.headers.get('content-type');
if (!contentType?.includes('application/json')) {
  throw new Error(
    `GraphQL endpoint returned non-JSON (status ${res.status}). ` +
    `Probabilmente SiteGround ha restituito una pagina HTML di errore.`
  );
}

const json = await res.json();
```

---

## Fix 2 — Retry con backoff sul fetch GraphQL (entrambi i siti)

**Problema:** `ETIMEDOUT` su `35.214.136.187:443` — Vercel non riesce a raggiungere
SiteGround entro il timeout e crasha invece di riprovare.

**Implementazione:** Wrappa il fetch in una funzione con retry automatico.

```js
async function fetchWithRetry(url, options, retries = 3, delay = 500) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      const contentType = res.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error(`Non-JSON response (status ${res.status})`);
      }
      return await res.json();
    } catch (err) {
      if (i < retries - 1) {
        console.warn(`Fetch attempt ${i + 1} failed, retrying in ${delay}ms...`, err.message);
        await new Promise(r => setTimeout(r, delay * (i + 1))); // backoff crescente
      } else {
        throw err; // ultimo tentativo fallito, propaga l'errore
      }
    }
  }
}

// Utilizzo:
const json = await fetchWithRetry(process.env.WORDPRESS_API_URL, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query }),
});
```

---

## Fix 3 — Fallback su OpenGraph type (entrambi i siti)

**Problema:** `Error: Invalid OpenGraph type:` — il campo `type` arriva `null` o `""` da
WPGraphQL/Yoast e Next.js crasha perché non accetta valori vuoti.

**Dove intervenire:** Nel file dove costruisci il metadata (es. `generateMetadata()` in
`app/[slug]/page.js` o simile).

**Implementazione:**
```js
export async function generateMetadata({ params }) {
  const data = await fetchPageData(params.slug);

  return {
    openGraph: {
      type: data?.seo?.openGraphType || 'website', // fallback a "website"
      title: data?.seo?.title || data?.title,
      description: data?.seo?.metaDesc || '',
      // ...altri campi
    },
  };
}
```

---

## Fix 4 — Apple Touch Icon (entrambi i siti)

**Problema:** Safari cerca `/apple-touch-icon-152x152.png` e riceve 404, sporcando i log.

**Soluzione:** Aggiungere un'icona 180x180px in `/public/apple-touch-icon.png` e
dichiarla nel `<head>`.

**In `app/layout.js`:**
```jsx
export const metadata = {
  // ...
  icons: {
    apple: '/apple-touch-icon.png',
  },
};
```

Oppure nel tag `<head>` manuale:
```jsx
<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
```

---

## Note per Claude Code CLI

- I Fix 1 e 2 vanno applicati alla funzione di fetch centrale (molto probabilmente `lib/api.js`
  o `lib/wordpress.js`) — non serve toccare ogni singola pagina.
- Il Fix 3 va applicato in ogni `generateMetadata()` che usa dati SEO da WPGraphQL.
- Il Fix 4 è puramente aggiunta di asset + una riga di metadata.
- Verificare che `process.env.WORDPRESS_API_URL` sia correttamente settato sia in locale
  (`.env.local`) che su Vercel (dashboard → Environment Variables).
