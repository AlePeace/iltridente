import { BlockRenderer } from "components/BlockRenderer";
import { getPage } from "utils/getPage";
import { notFound } from "next/navigation";
import { getSeo } from "utils/getSeo";
import { setRequestLocale } from "next-intl/server";

export default async function Home({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  // Homepage: italiano "/", inglese "/en/" o prova anche "/"
  const uri = locale === "it" ? "/" : `/${locale}/`;
  let data = await getPage(uri, locale);

  // Fallback: cerca la homepage italiana e usa le translations
  if (!data && locale !== "it") {
    console.log(`[Home] Trying Italian homepage fallback`);
    data = await getPage("/", locale);
  }

  // Ultimo fallback: mostra contenuto italiano
  if (!data && locale !== "it") {
    data = await getPage("/", "it");
  }

  if (!data) {
    notFound();
  }
  return <BlockRenderer blocks={data} />;
}

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const uri = locale === "it" ? "/" : `/${locale}/`;
  let seo = await getSeo(uri, locale);

  if (!seo && locale !== "it") {
    seo = await getSeo("/", locale);
  }

  return {
    title: seo?.title || "",
    description: seo?.description || "",
    robots: seo?.robots || "",
    canonical: seo?.canonicalUrl || "https://iltridentepositano.com/",
    openGraph: {
      locale: seo?.openGraph?.locale || "",
      siteName: seo?.openGraph?.siteName || "",
      type: seo?.openGraph?.type || "",
      title: seo?.openGraph?.title || "",
      description: seo?.openGraph?.description || "",
      url: seo?.openGraph?.url || "",
    },
    twitter: {
      card: seo?.openGraph?.twitterMeta?.card || "",
      title: seo?.openGraph?.twitterMeta?.title || "",
      description: seo?.openGraph?.twitterMeta?.description || "",
    },
  };
}
