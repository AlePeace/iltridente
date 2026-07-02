import { BlockRenderer } from "components/BlockRenderer";
import { getPage } from "utils/getPage";
import { getAllPages } from "utils/getAllPages";
import { notFound, redirect } from "next/navigation";
import { getSeo } from "utils/getSeo";
import { setRequestLocale } from "next-intl/server";
import { AlternatesSync } from "components/AlternatesSync/AlternatesSync";

export async function generateStaticParams() {
  const pages = await getAllPages();
  return pages
    .map((page) => {
      const locale = page.language?.code?.toLowerCase() || "it";
      let uri = (page.uri || "").replace(/^\//, "").replace(/\/$/, "");
      if (uri.startsWith(`${locale}/`)) uri = uri.slice(`${locale}/`.length);
      const slug = uri.split("/").filter(Boolean);
      return slug.length > 0 ? { locale, slug } : null;
    })
    .filter(Boolean);
}

export default async function Page({ params }) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const slugPath = slug.join("/");
  const uri = locale === "it" ? `/${slugPath}/` : `/${locale}/${slugPath}/`;

  let result = await getPage(uri, locale);

  if (!result && locale !== "it") {
    result = await getPage(`/${slugPath}/`, locale);
  }

  if (!result && locale !== "it") {
    result = await getPage(`/${slugPath}/`, "it");
  }

  // Fallback gateway: molti clienti digitano l'URL "corto" (es. /room-services)
  // invece di quello reale sotto /gateway (es. /gateway/room-services). Se la
  // pagina corta non esiste ma esiste la versione gateway, redirect a quella.
  // Funziona in automatico per qualsiasi sottopagina gateway (anche future).
  if (!result && slug[0] !== "gateway") {
    const gatewayPath = `gateway/${slugPath}`;
    const gatewayUri =
      locale === "it" ? `/${gatewayPath}/` : `/${locale}/${gatewayPath}/`;

    let gateway = await getPage(gatewayUri, locale);
    if (!gateway && locale !== "it") {
      gateway = await getPage(`/${gatewayPath}/`, locale);
    }
    if (!gateway && locale !== "it") {
      gateway = await getPage(`/${gatewayPath}/`, "it");
    }

    if (gateway) {
      redirect(
        locale === "it" ? `/${gatewayPath}` : `/${locale}/${gatewayPath}`,
      );
    }
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
  const { slug, locale } = await params;
  const slugPath = slug.join("/");
  const uri = locale === "it" ? `/${slugPath}/` : `/${locale}/${slugPath}/`;
  let seo = await getSeo(uri, locale);

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
      type: seo?.openGraph?.type || "website",
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
