import { Nunito_Sans } from "next/font/google";
import { Cinzel } from "next/font/google";
import "../styles/globals.css";
import { getMenu } from "utils/getMenu";
import { MainMenu } from "components/MainMenu";
import { SmoothScroll } from "components/SmoothScroll";
import Script from "next/script";

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

export default async function RootLayout({ children }) {
  const menus = await getMenu();
  return (
    <html lang="it">
      <body className={`${nunito.variable} ${cinzel.variable}`}>
        <SmoothScroll>
          <MainMenu menuData={menus} menus={menus} />
          {children}
        </SmoothScroll>
        <Script
          id="guestplan-widget"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
window._gstpln = {
			accessKey: "3cb8485b4afa8777b92ba4a13d11ca93af2e2d4d",
			open: false,
			locale: "it"
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
      </body>
    </html>
  );
}
