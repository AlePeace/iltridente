export const getSeo = async (uri) => {
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
  if (!data.nodeByUri) {
    return null;
  }
  return data.nodeByUri.seo;
};
