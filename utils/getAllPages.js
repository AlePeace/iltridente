export const getAllPages = async () => {
  const params = {
    query: `
      query AllPagesQuery {
        pages(first: 200, where: { status: PUBLISH }) {
          nodes {
            uri
            language { code }
          }
        }
      }
    `,
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
    console.error(`[getAllPages] fetch failed:`, err?.message);
    return [];
  }

  const { data } = await response.json();
  return data?.pages?.nodes ?? [];
};
