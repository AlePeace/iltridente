import { fetchGraphQL } from "./fetchGraphQL";

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

  const json = await fetchGraphQL(query, undefined, { tag: "getHeaderLogo" });
  return json?.data?.mediaItem || null;
};
