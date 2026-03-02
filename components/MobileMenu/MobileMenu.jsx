"use client";

import { useState } from "react";
import Link from "next/link";
import { ButtonHeader } from "../ButtonHeader/ButtonHeader";

export const MobileMenu = ({ navItems, menuData, menus }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="fullMenu"
          aria-label="Toggle menu"
          className="flex flex-col gap-1.5 focus:outline-none relative z-9997 w-10 h-10 justify-center items-center"
        >
          <span
            className={`block w-8 h-0.5 bg-red transition-all duration-300 ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`block w-8 h-0.5 bg-red transition-all duration-300 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-8 h-0.5 bg-red transition-all duration-300 ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </div>
      <div
        id="fullMenu"
        className={`lg:hidden fixed left-0 top-0 w-full bg-white z-9995 overflow-hidden transition-all duration-500 ease-in-out
          ${open ? "h-[100dvh] opacity-100 pt-28 px-10" : "h-0 opacity-0 pt-0 px-10 pointer-events-none"}`}
      >
        <div className="space-y-10 flex flex-col items-start justify-center">
          {navItems?.length > 0 && (
            <nav>
              <ul className="flex flex-col gap-10">
                {navItems.map((item, idx) => (
                  <li
                    className="font-nunito font-normal text-text text-2xl transition-all duration-300 ease-in-out hover:text-red"
                    key={item.uri ?? idx}
                  >
                    <Link href={item.uri} onClick={() => setOpen(false)}>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <ButtonHeader menuData={menuData} menus={menus} />
        </div>
      </div>
    </>
  );
};
