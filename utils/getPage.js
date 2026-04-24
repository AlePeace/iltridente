import { cleanAndTransformBlocks } from "./cleanAndTransformBlocks";

const buildAlternates = (page) => {
  const alternates = {};
  const locale = page.language?.code?.toLowerCase();
  if (locale && page.uri) alternates[locale] = page.uri;
  for (const t of page.translations ?? []) {
    const loc = t.language?.code?.toLowerCase();
    if (loc && t.uri) alternates[loc] = t.uri;
  }
  return alternates;
};

export const getPage = async (uri, locale = "it") => {
  console.log(`[getPage] Fetching URI: "${uri}", locale: "${locale}"`);

  const params = {
    query: `
      query PageQuery($uri: String!) {
        nodeByUri(uri: $uri) {
          ... on Page {
            id
            title
            blocks(postTemplate: false)
            language {
              code
            }
            translations {
              id
              title
              uri
              blocks(postTemplate: false)
              language {
                code
              }
            }
          }
        }
      }
    `,
    variables: { uri },
  };

  let response;
  try {
    response = await fetch(process.env.WP_GRAPHQL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      next: { revalidate: 86400 },
    });
  } catch (err) {
    console.error(`[getPage] fetch failed for "${uri}":`, err?.message);
    return null;
  }

  const { data, errors } = await response.json();

  if (errors) {
    console.error(`[getPage] GraphQL errors:`, JSON.stringify(errors, null, 2));
  }

  console.log(
    `[getPage] nodeByUri result:`,
    data?.nodeByUri
      ? `Found page "${data.nodeByUri.title}" (lang: ${data.nodeByUri.language?.code})`
      : "NULL - page not found",
  );

  if (data?.nodeByUri?.translations?.length > 0) {
    console.log(
      `[getPage] Available translations:`,
      data.nodeByUri.translations.map(
        (t) => `${t.language?.code}: "${t.title}" (${t.uri})`,
      ),
    );
  } else {
    console.log(`[getPage] No translations available`);
  }

  if (!data?.nodeByUri) {
    return null;
  }

  const page = data.nodeByUri;
  const pageLanguage = page.language?.code?.toLowerCase();
  const alternates = buildAlternates(page);

  // Se la pagina trovata è già nella lingua richiesta, usala direttamente
  if (pageLanguage === locale) {
    console.log(`[getPage] ✅ Page is already in requested locale "${locale}"`);
    return { blocks: cleanAndTransformBlocks(page.blocks), alternates };
  }

  // Altrimenti cerca tra le traduzioni
  const translation = page.translations?.find(
    (t) => t.language?.code?.toLowerCase() === locale,
  );

  if (translation) {
    console.log(
      `[getPage] ✅ Found translation in "${locale}": "${translation.title}"`,
    );
    return { blocks: cleanAndTransformBlocks(translation.blocks), alternates };
  }

  console.log(
    `[getPage] ⚠️ No translation found for "${locale}", using fallback (${pageLanguage})`,
  );
  return { blocks: cleanAndTransformBlocks(page.blocks), alternates };
};
