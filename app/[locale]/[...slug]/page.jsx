import { BlockRenderer } from "components/BlockRenderer";
import { getPage } from "utils/getPage";
import { notFound } from "next/navigation";
import { getSeo } from "utils/getSeo";
import { setRequestLocale } from "next-intl/server";

export default async function Page({ params }) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const slugPath = slug.join("/");

  // Prova l'URI nella lingua richiesta
  const uri = locale === "it" ? `/${slugPath}/` : `/${locale}/${slugPath}/`;
  let data = await getPage(uri, locale);

  // Se non trovata e non è italiano, prova l'URI italiano come fallback
  // (la pagina potrebbe non essere ancora tradotta ma getPage cercherà nelle translations)
  if (!data && locale !== "it") {
    console.log(`[Page] Trying Italian fallback for "/${slugPath}/"`);
    data = await getPage(`/${slugPath}/`, locale);
  }

  // Se ancora non trovata, prova con l'URI italiano e accetta la lingua italiana
  if (!data && locale !== "it") {
    console.log(`[Page] Trying Italian content as last fallback`);
    data = await getPage(`/${slugPath}/`, "it");
  }

  if (!data) {
    notFound();
  }
  return <BlockRenderer blocks={data} />;
}

export async function generateMetadata({ params }) {
  const { slug, locale } = await params;
  const slugPath = slug.join("/");
  const uri = locale === "it" ? `/${slugPath}/` : `/${locale}/${slugPath}/`;
  let seo = await getSeo(uri, locale);

  // Fallback SEO
  if (!seo && locale !== "it") {
    seo = await getSeo(`/${slugPath}/`, locale);
  }

  return {
    title: seo?.title || "",
    description: seo?.description || "",
    robots: seo?.robots || "",
    canonical: seo?.canonicalUrl || "",
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
