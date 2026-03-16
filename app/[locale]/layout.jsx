import { Nunito_Sans, Cinzel } from "next/font/google";
import "../../styles/globals.css";
import { getMenu } from "utils/getMenu";
import { MainMenu } from "components/MainMenu";
import { SmoothScroll } from "components/SmoothScroll";
import Script from "next/script";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../../i18n/routing";
import CookieConsentBanner from "components/CookieConsent/CookieConsent";

const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "700", "800", "900"],
  variable: "--font-nunito",
});
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cinzel",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const messages = await getMessages();
  const menus = await getMenu(locale);

  return (
    <html lang={locale}>
      <body className={`${nunito.variable} ${cinzel.variable}`}>
        <NextIntlClientProvider messages={messages}>
          <SmoothScroll>
            <MainMenu menuData={menus} menus={menus} />
            {children}
            <CookieConsentBanner />
          </SmoothScroll>
          <Script
            id="guestplan-widget"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
window._gstpln = {
  accessKey: "3cb8485b4afa8777b92ba4a13d11ca93af2e2d4d",
  open: false,
  locale: "${locale}"
};
_gstpln.showFab = false;
(function(g, s, t, p, l, n) {
  l = s.createElement(t);
  n = s.getElementsByTagName(t)[0];
  l.async = 1;
  l.src = p;
  n.parentNode.insertBefore(l, n);
})(window, document, "script", "https://cdn.guestplan.com/widget.js");
              `,
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
