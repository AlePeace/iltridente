import { getTranslations } from "next-intl/server";
import { getPage } from "utils/getPage";
import { Footer } from "components/Footer";
import { Link } from "i18n/navigation";

export default async function NotFound() {
  const t = await getTranslations("notFound");

  const result = await getPage("/", "it");
  const footerBlock = result?.blocks?.find(
    (block) =>
      block.name === "core/group" &&
      (block.attributes?.metadata?.name === "Footer" ||
        block.attributes?.className === "Footer"),
  );

  return (
    <>
      <main className="min-h-screen flex flex-col items-center justify-center px-5 text-center">
        <p className="font-cinzel text-8xl font-bold text-red mb-4">404</p>
        <h1 className="font-nunito text-3xl font-bold text-text mb-4">
          {t("title")}
        </h1>
        <p className="font-nunito text-lg text-brown mb-10">
          {t("description")}
        </p>
        <Link
          href="/"
          className="py-2.5 px-8 bg-red text-white font-nunito font-normal rounded-lg border border-red hover:bg-red/90 transition-colors inline-block"
        >
          {t("backHome")}
        </Link>
      </main>
      {footerBlock && <Footer blocks={footerBlock} />}
    </>
  );
}
