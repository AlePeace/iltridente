import { BlockRenderer } from "components/BlockRenderer";
import { getPage } from "utils/getPage";
import { notFound } from "next/navigation";
import { getSeo } from "utils/getSeo";
import { setRequestLocale } from "next-intl/server";
import { AlternatesSync } from "components/AlternatesSync/AlternatesSync";

export default async function Home({ params }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const uri = locale === "it" ? "/" : `/${locale}/`;
  let result = await getPage(uri, locale);

  if (!result && locale !== "it") {
    console.log(`[Home] Trying Italian homepage fallback`);
    result = await getPage("/", locale);
  }

  if (!result && locale !== "it") {
    result = await getPage("/", "it");
  }

  if (!result) {
    notFound();
  }

  const { blocks, alternates } = result;

  return (
    <>
      <AlternatesSync alternates={alternates} />
      <BlockRenderer blocks={blocks} />
    </>
  );
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
      images: seo?.ogImage ? [seo.ogImage] : [],
    },
    twitter: {
      card: seo?.openGraph?.twitterMeta?.card || "",
      title: seo?.openGraph?.twitterMeta?.title || "",
      description: seo?.openGraph?.twitterMeta?.description || "",
    },
  };
}
