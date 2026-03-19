const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://iltridentepositano.com";

async function getAllPages() {
  const params = {
    query: `
      query SitemapQuery {
        pages(first: 100, where: { status: PUBLISH }) {
          nodes {
            uri
            modified
            language {
              code
            }
            translations {
              uri
              modified
              language {
                code
              }
            }
          }
        }
      }
    `,
  };

  const response = await fetch(process.env.WP_GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
    next: { revalidate: 86400 },
  });

  const { data } = await response.json();
  return data?.pages?.nodes || [];
}

function uriToUrl(uri) {
  // uri è un path tipo "/" o "/chi-siamo/" o "/en/about/"
  const path = uri.replace(/\/$/, "");
  return path ? `${SITE_URL}${path}` : SITE_URL;
}

export default async function sitemap() {
  const pages = await getAllPages();
  const entries = [];
  const seenUris = new Set();

  for (const page of pages) {
    const lang = page.language?.code?.toLowerCase();

    // Processa solo le pagine nella lingua di default (IT) per evitare duplicati
    if (lang !== "it" || seenUris.has(page.uri)) continue;

    seenUris.add(page.uri);
    entries.push({
      url: uriToUrl(page.uri),
      lastModified: new Date(page.modified),
      changeFrequency: "monthly",
      priority: page.uri === "/" ? 1.0 : 0.8,
    });

    // Aggiungi le traduzioni
    for (const translation of page.translations || []) {
      if (seenUris.has(translation.uri)) continue;
      seenUris.add(translation.uri);
      entries.push({
        url: uriToUrl(translation.uri),
        lastModified: new Date(translation.modified),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  }

  return entries;
}
