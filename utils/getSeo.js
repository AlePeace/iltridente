export const getSeo = async (uri, locale = "it") => {
  const params = {
    query: `
      query SeoQuery($uri: String!) {
        nodeByUri(uri: $uri) {
          ... on Page {
            seo {
              title
              description
              robots
              canonicalUrl
              openGraph {
                locale
                siteName
                type
                title
                description
                url
                twitterMeta {
                  card
                  title
                  description
                }
              }
            }
            language {
              code
            }
            translations {
              seo {
                title
                description
                robots
                canonicalUrl
                openGraph {
                  locale
                  siteName
                  type
                  title
                  description
                  url
                  twitterMeta {
                    card
                    title
                    description
                  }
                }
              }
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
  });

  const { data } = await response.json();

  if (!data?.nodeByUri) {
    return null;
  }

  const page = data.nodeByUri;
  const pageLanguage = page.language?.code?.toLowerCase();

  // Se la pagina è già nella lingua richiesta
  if (pageLanguage === locale) {
    return page.seo;
  }

  // Cerca tra le traduzioni
  const translation = page.translations?.find(
    (t) => t.language?.code?.toLowerCase() === locale,
  );

  if (translation) {
    return translation.seo;
  }

  // Fallback
  return page.seo;
};
