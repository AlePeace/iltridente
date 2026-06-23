import { fetchGraphQL } from "./fetchGraphQL";

export const getAllPages = async () => {
  const query = `
      query AllPagesQuery {
        pages(first: 200, where: { status: PUBLISH }) {
          nodes {
            uri
            language { code }
          }
        }
      }
    `;

  const json = await fetchGraphQL(query, undefined, { tag: "getAllPages" });
  return json?.data?.pages?.nodes ?? [];
};
