export const getBlockLink = (block) => {
  if (!block) return null;

  const { href, linkDestination } = block.attributes || {};

  if (!linkDestination || linkDestination === "none") return null;

  return href || null;
};