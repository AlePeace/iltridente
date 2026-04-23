const processSeoUrls = (seo) => {
  if (!seo) return seo;
  const wpUrl = process.env.NEXT_PUBLIC_WP_URL || "";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  if (!wpUrl || !siteUrl) return seo;

  return {
    ...seo,
    canonicalUrl: seo.canonicalUrl?.replace(wpUrl, siteUrl),
    openGraph: seo.openGraph
      ? {
          ...seo.openGraph,
          url: seo.openGraph.url?.replace(wpUrl, siteUrl),
        }
      : seo.openGraph,
  };
};

export const getSeo = async (uri, locale = "it") => {
  const params = {
    query: `
      query SeoQuery($uri: String!) {
        nodeByUri(uri: $uri) {
          ... on Page {
            featuredImage {
              node {
                sourceUrl
                altText
                mediaDetails {
                  width
                  height
                }
              }
            }
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
              featuredImage {
                node {
                  sourceUrl
                  altText
                  mediaDetails {
                    width
                    height
                  }
                }
              }
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
    next: { revalidate: 86400 },
  });

  const { data } = await response.json();
  console.log(`[getSeo] uri="${uri}" locale="${locale}"`, 
  JSON.stringify({
    found: !!data?.nodeByUri,
    pageLanguage: data?.nodeByUri?.language?.code,
    seoTitle: data?.nodeByUri?.seo?.title,
    translations: data?.nodeByUri?.translations?.map(t => ({
      lang: t.language?.code,
      title: t.seo?.title
    }))
  })
);

  if (!data?.nodeByUri) {
    return null;
  }

  const page = data.nodeByUri;
  const pageLanguage = page.language?.code?.toLowerCase();

  const extractOgImage = (node, featuredImage) => {
    const img = featuredImage?.node;
    if (!img?.sourceUrl) return null;
    return {
      url: img.sourceUrl,
      width: img.mediaDetails?.width || null,
      height: img.mediaDetails?.height || null,
      alt: img.altText || "",
    };
  };

  // Se la pagina è già nella lingua richiesta
  if (pageLanguage === locale) {
    return { ...processSeoUrls(page.seo), ogImage: extractOgImage(page, page.featuredImage) };
  }

  // Cerca tra le traduzioni
  const translation = page.translations?.find(
    (t) => t.language?.code?.toLowerCase() === locale,
  );

  if (translation) {
    return { ...processSeoUrls(translation.seo), ogImage: extractOgImage(translation, translation.featuredImage) };
  }

  // Fallback
  return { ...processSeoUrls(page.seo), ogImage: extractOgImage(page, page.featuredImage) };
};
