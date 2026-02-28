import { Nunito_Sans } from "next/font/google";
import { Cinzel } from "next/font/google";
import "../styles/globals.css";
import { getMenu } from "utils/getMenu";
import { MainMenu } from "components/MainMenu";
import { SmoothScroll } from "components/SmoothScroll";


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
      </body>
    </html>
  );
}
