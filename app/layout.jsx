import localFont from "next/font/local";
import { Nunito_Sans } from "next/font/google";
import "../styles/globals.css";
import { getMenu } from "utils/getMenu";
import { MainMenu } from "components/MainMenu";
import { SmoothScroll } from "components/SmoothScroll";


const nunito = Nunito_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "600", "700", "800", "900"],
  variable: "--font-nunito",
});

export default async function RootLayout({ children }) {
  const menus = await getMenu();
  return (
    <html lang="it">
      <body className={`${nunito.variable}`}>
        <SmoothScroll>
          <MainMenu menuData={menus} menus={menus} />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
