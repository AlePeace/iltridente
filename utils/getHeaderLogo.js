export const getHeaderLogo = async () => {
  const query = `
    query HeaderLogo {
      mediaItem(id: 55, idType: DATABASE_ID) {
        sourceUrl
        altText
        mediaDetails {
          width
          height
        }
      }
    }
  `;

  const res = await fetch(process.env.WP_GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
    next: { revalidate: 86400 },
  });

  const json = await res.json();
  return json?.data?.mediaItem || null;
};
