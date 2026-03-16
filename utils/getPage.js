import { cleanAndTransformBlocks } from "./cleanAndTransformBlocks";

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

  const response = await fetch(process.env.WP_GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
    next: { revalidate: 86400 },
  });

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

  // Se la pagina trovata è già nella lingua richiesta, usala direttamente
  if (pageLanguage === locale) {
    console.log(`[getPage] ✅ Page is already in requested locale "${locale}"`);
    const blocks = cleanAndTransformBlocks(page.blocks);
    return blocks;
  }

  // Altrimenti cerca tra le traduzioni
  const translation = page.translations?.find(
    (t) => t.language?.code?.toLowerCase() === locale,
  );

  if (translation) {
    console.log(
      `[getPage] ✅ Found translation in "${locale}": "${translation.title}"`,
    );
    const blocks = cleanAndTransformBlocks(translation.blocks);
    return blocks;
  }

  console.log(
    `[getPage] ⚠️ No translation found for "${locale}", using fallback (${pageLanguage})`,
  );
  // Fallback: usa la pagina originale
  const blocks = cleanAndTransformBlocks(page.blocks);
  return blocks;
};
