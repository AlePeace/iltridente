import { ButtonHeader } from "components/ButtonHeader";
import { LanguageSwitcher } from "components/LanguageSwitcher";
import { MobileMenu } from "components/MobileMenu/MobileMenu";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { getHeaderLogo } from "utils/getHeaderLogo";

export const MainMenu = async ({ menuData, menus }) => {
  const headerLogo = await getHeaderLogo();
  const data = menuData ?? menus;

  // normalizza più possibili formati dalla GraphQL
  let nodes = [];
  if (!data) {
    nodes = [];
  } else if (Array.isArray(data)) {
    // formato: [ { menuItems: { nodes: [...] } }, ... ]
    nodes = data.flatMap((d) => d?.menuItems?.nodes ?? []);
  } else if (data.menuItems?.nodes) {
    // formato: { menuItems: { nodes: [...] } }
    nodes = data.menuItems.nodes;
  } else if (Array.isArray(data.nodes)) {
    // formato: { nodes: [ { menuItems: { nodes: [...] } } ] }
    nodes = data.nodes.flatMap((n) => n?.menuItems?.nodes ?? []);
  }
  const navItems = nodes.filter(
    (item) => !item?.cssClasses?.includes("cta-header"),
  );

  return (
    <>
      <header className="fixed w-full justify-between p-5 lg:px-12 bg-white top-0 left-0 z-9997 flex items-center">
        <div className="w-full lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          <div className="justify-self-start">
            {headerLogo?.sourceUrl && (
              <Link href="/" className="block">
                <Image
                  src={headerLogo.sourceUrl}
                  alt={headerLogo.altText || "Logo"}
                  width={headerLogo.mediaDetails?.width || 160}
                  height={headerLogo.mediaDetails?.height || 60}
                  priority
                  fetchPriority="high"
                  className="w-36 h-auto relative z-9997"
                />
              </Link>
            )}
          </div>
          <div className="justify-self-center">
            {navItems.length > 0 && (
              <nav>
                <ul className="hidden lg:flex lg:gap-10">
                  {navItems.map((item, idx) => (
                    <li
                      className="font-nunito font-normal text-text text-sm transition-all duration-300 ease-in-out hover:text-red"
                      key={item.uri ?? idx}
                    >
                      <Link href={item.uri}>{item.label}</Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
          <div className="hidden lg:block justify-self-end">
            <div className="flex gap-3 items-center">
              <LanguageSwitcher />
              <ButtonHeader menuData={menuData} menus={menus} />
            </div>
          </div>
        </div>
        <div className="lg:hidden flex items-center gap-2">
          <LanguageSwitcher />
          <MobileMenu navItems={navItems} menuData={menuData} menus={menus} />
        </div>
      </header>
    </>
  );
};
