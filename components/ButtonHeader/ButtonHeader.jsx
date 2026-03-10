"use client";

import Link from "next/link";

export const ButtonHeader = ({ menuData, menus }) => {
  const data = menuData ?? menus;

  const first = Array.isArray(data) ? data[0] : data;

  const rawItems =
    first?.menuItems?.nodes ??
    first?.nodes ??
    first?.items ??
    first?.data?.menuItems?.nodes ??
    first?.menu?.menuItems?.nodes ??
    first?.items?.edges?.map((e) => e?.node) ??
    [];

  const nodes = Array.isArray(rawItems) ? rawItems : [];

  const ctaItem = nodes.find((item) => {
    const classes = item?.cssClasses;
    if (Array.isArray(classes)) return classes.includes("cta-header");
    if (typeof classes === "string")
      return classes.split(" ").includes("cta-header");
    return false;
  });

  if (!ctaItem) return null;

  return (
    <div>
      <Link
        href={ctaItem.uri ?? "#"}
        className="cursor-pointer py-2.5 px-5 bg-red text-sm text-white font-nunito font-normal rounded-lg border border-red hover:bg-red/90 inline-block"
      >
        {ctaItem.label}
      </Link>
    </div>
  );
};
