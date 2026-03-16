export const getMenu = async (locale = "it") => {
  console.log(`[getMenu] Fetching menu for locale: "${locale}"`);

  const query = `
    query MenusQuery($language: String!) {
      menus(where: {language: $language}) {
        nodes {
          menuItems {
            nodes {
              uri
              label
              cssClasses
              target
            }
          }
          language {
            code
          }
        }
      }
    }
  `;

  const res = await fetch(process.env.WP_GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables: { language: locale } }),
    next: { revalidate: 86400 },
  });

  const json = await res.json();
  const nodes = json?.data?.menus?.nodes || [];

  console.log(`[getMenu] Found ${nodes.length} menus for locale "${locale}"`);

  // Se non ci sono menu per questa lingua, fallback all'italiano
  if (nodes.length === 0 && locale !== "it") {
    console.log(
      `[getMenu] ⚠️ No menu found for "${locale}", falling back to "it"`,
    );
    return getMenu("it");
  }

  return nodes;
};
