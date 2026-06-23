/**
 * Fetch centralizzato verso l'endpoint WPGraphQL.
 *
 * Risolve due problemi ricorrenti del backend SiteGround:
 *  - Fix 1: a volte risponde con HTML (pagina di errore/manutenzione) anche con
 *    status 200 → `res.json()` crasha con `SyntaxError: Unexpected token '<'`.
 *    Qui controlliamo il content-type prima di parsare.
 *  - Fix 2: a volte va in timeout (`ETIMEDOUT`) → riproviamo con backoff crescente.
 *
 * In caso di fallimento ritorna `null` (i chiamanti già gestiscono questo caso
 * con i loro fallback), così una singola pagina non manda giù l'intero render.
 *
 * @param {string} query           Query GraphQL.
 * @param {object} [variables]     Variabili della query.
 * @param {object} [options]
 * @param {number} [options.retries=3]      Numero massimo di tentativi.
 * @param {number} [options.delay=500]      Delay base (ms) tra i tentativi.
 * @param {number} [options.revalidate=86400] ISR revalidate (secondi).
 * @param {string} [options.tag]            Etichetta per i log (es. "getPage /").
 * @returns {Promise<object|null>} La risposta JSON ({ data, errors }) oppure null.
 */
export async function fetchGraphQL(
  query,
  variables,
  { retries = 3, delay = 500, revalidate = 86400, tag } = {},
) {
  const url = process.env.WP_GRAPHQL_URL;
  const label = tag ? ` (${tag})` : "";

  if (!url) {
    console.error(`[fetchGraphQL] WP_GRAPHQL_URL non configurato${label}`);
    return null;
  }

  const body = JSON.stringify(variables ? { query, variables } : { query });

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        next: { revalidate },
      });

      // Fix 1 — non fidarsi del body: se non è JSON, non chiamare res.json()
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        const preview = (await res.text())
          .slice(0, 120)
          .replace(/\s+/g, " ")
          .trim();
        throw new Error(
          `risposta non-JSON (status ${res.status}, content-type "${contentType}"): ${preview}`,
        );
      }

      const json = await res.json();

      if (json?.errors?.length) {
        console.error(
          `[fetchGraphQL] errori GraphQL${label}:`,
          JSON.stringify(json.errors),
        );
      }

      return json;
    } catch (err) {
      const isLast = attempt === retries;
      if (isLast) {
        console.error(
          `[fetchGraphQL] tutti i ${retries} tentativi falliti${label}: ${err?.message}`,
        );
        return null;
      }
      // Fix 2 — backoff crescente: 500ms, 1000ms, 1500ms...
      console.warn(
        `[fetchGraphQL] tentativo ${attempt}/${retries}${label} fallito (${err?.message}), riprovo tra ${delay * attempt}ms`,
      );
      await new Promise((r) => setTimeout(r, delay * attempt));
    }
  }

  return null;
}
