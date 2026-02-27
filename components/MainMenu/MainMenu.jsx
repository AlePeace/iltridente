import Link from "next/link";
import React from "react";

export const MainMenu = ({ menuData, menus }) => {
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

  if (nodes.length === 0) return null; // non mostrare nulla se vuoto

  return (
    <nav className="fixed top-0 left-0 z-[9996]">
      <ul>
        {nodes.map((item, idx) => (
          <li key={item.uri ?? idx}>
            <Link href={item.uri}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
