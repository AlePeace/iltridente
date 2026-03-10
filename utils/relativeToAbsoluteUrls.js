export const relativeToAbsoluteUrls = (htmlString = "") => {
  let result = htmlString.split(process.env.NEXT_PUBLIC_WP_URL).join("");
  // Rimuovi prefissi lingua WPML dagli URL interni (/en/, /it/, ecc.)
  // Questi verranno gestiti dal routing next-intl
  return result;
};
