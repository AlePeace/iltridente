const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./i18n/request.js");

// Estrae l'hostname accettando sia un hostname puro (es. "wp.esempio.com")
// sia un URL completo (es. "https://wp.esempio.com/graphql").
function toHostname(value) {
  if (!value) return null;
  try {
    return new URL(value).hostname;
  } catch {
    return value.replace(/^https?:\/\//, "").split("/")[0] || null;
  }
}

// Host consentiti per next/image. Se le env mancano (es. dev senza .env.local)
// l'array resta vuoto e il dev server parte comunque senza crashare.
const imageHosts = [
  ...new Set(
    [process.env.WP_IMAGES_URL, process.env.NEXT_PUBLIC_WP_URL]
      .map(toHostname)
      .filter(Boolean),
  ),
];

const remotePatterns = imageHosts.map((hostname) => ({
  protocol: "https",
  hostname,
}));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns,
  },
};

module.exports = withNextIntl(nextConfig);
