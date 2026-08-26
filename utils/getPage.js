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

  if (!json) {
    // fetchGraphQL ha fallito tutti i tentativi (es. SiteGround Security
    // risponde con una pagina di CAPTCHA invece di JSON su /graphql): non
    // significa che la pagina non esista, è un problema infrastrutturale
    // temporaneo. In build (next build) degradiamo comunque a null per non
    // far fallire l'intera build su un singolo hiccup del backend; a runtime
    // invece rilanciamo l'errore, così se questo accade durante una
    // rigenerazione ISR Next.js continua a servire l'ultima versione buona
    // in cache invece di sostituirla con un 404 (che poi resterebbe visibile
    // fino alla prossima rigenerazione riuscita).
    if (process.env.NEXT_PHASE === "phase-production-build") {
      return null;
    }
    throw new Error(`getPage: fetch WPGraphQL fallito per ${uri}`);
  }

  const data = json.data;

  if (!data?.nodeByUri) {
    // Qui invece WordPress ha risposto correttamente dicendo che l'URI non
    // esiste: è un notFound legittimo.
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
