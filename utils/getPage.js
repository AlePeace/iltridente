import { cleanAndTransformBlocks } from "./cleanAndTransformBlocks";
import { fetchGraphQL } from "./fetchGraphQL";

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
  const query = `
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
    `;

  const json = await fetchGraphQL(query, { uri }, { tag: `getPage ${uri}` });
  const data = json?.data;

  if (!data?.nodeByUri) {
    return null;
  }

  const page = data.nodeByUri;
  const pageLanguage = page.language?.code?.toLowerCase();
  const alternates = buildAlternates(page);

  // Se la pagina trovata è già nella lingua richiesta, usala direttamente
  if (pageLanguage === locale) {
    return { blocks: cleanAndTransformBlocks(page.blocks), alternates };
  }

  // Altrimenti cerca tra le traduzioni
  const translation = page.translations?.find(
    (t) => t.language?.code?.toLowerCase() === locale,
  );

  if (translation) {
    return { blocks: cleanAndTransformBlocks(translation.blocks), alternates };
  }

  return { blocks: cleanAndTransformBlocks(page.blocks), alternates };
};
