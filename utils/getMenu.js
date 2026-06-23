import { fetchGraphQL } from "./fetchGraphQL";

export const getMenu = async (locale = "it") => {
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

  const json = await fetchGraphQL(
    query,
    { language: locale },
    { tag: `getMenu ${locale}` },
  );
  const nodes = json?.data?.menus?.nodes || [];

  // Se non ci sono menu per questa lingua, fallback all'italiano
  if (nodes.length === 0 && locale !== "it") {
    return getMenu("it");
  }

  return nodes;
};
