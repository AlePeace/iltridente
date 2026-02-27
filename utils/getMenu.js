export const getMenu = async () => {
  const query = `
    query MenusQuery {
      menus {
        nodes {
          menuItems {
            nodes {
              uri
              label
            }
          }
        }
      }
    }
  `;

  const res = await fetch(process.env.WP_GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
    cache: "no-store",
  });

  const json = await res.json();
  return json?.data?.menus?.nodes || [];
};
