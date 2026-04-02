"use client";

import { Button } from "components/Button";

// Stessi temi cromatici dell'AccordionMenu
const buttonThemes = [
  {
    // Lunch
    bg: "bg-cardspranzo",
    border: "border-cardspranzo",
    text: "text-red",
    hover: "hover:bg-red/10",
    arrow: "text-red",
  },
  {
    // Dinner
    bg: "bg-ocean",
    border: "border-ocean",
    text: "text-pink",
    hover: "hover:bg-ocean/80",
    arrow: "text-pink",
  },
  {
    // Bar
    bg: "bg-cardspranzo",
    border: "border-borderbutton",
    text: "text-ocean",
    hover: "hover:bg-cardspranzo/70",
    arrow: "text-ocean",
  },
  {
    // Chef / Default
    bg: "bg-white",
    border: "border-borderbutton",
    text: "text-text",
    hover: "hover:bg-cardspranzo/50",
    arrow: "text-dust",
  },
  {
    // Button 5
    bg: "bg-cardspranzo",
    border: "border-cardspranzo",
    text: "text-ocean",
    hover: "hover:bg-cardspranzo/70",
    arrow: "text-ocean",
  },
  {
    // Button 6
    bg: "bg-ocean",
    border: "border-ocean",
    text: "text-white",
    hover: "hover:bg-ocean/80",
    arrow: "text-white",
  },
];

export const ButtonsGateway = ({ blocks }) => {
  const innerBlocks = blocks?.innerBlocks || [];
  const buttons = innerBlocks
    .filter((block) => block.name === "core/button")
    .slice(0, 6);

  // Supporta anche struttura annidata: core/buttons > core/button
  const flatButtons =
    buttons.length > 0
      ? buttons
      : innerBlocks
          .filter((block) => block.name === "core/buttons")
          .flatMap((b) => b.innerBlocks || [])
          .filter((b) => b.name === "core/button")
          .slice(0, 6);

  const items = flatButtons.length > 0 ? flatButtons : [];

  return (
    <section className="py-10 lg:py-16 max-w-xl mx-auto px-5">
      <div className="flex flex-col gap-4">
        {items.map((block, index) => {
          const theme =
            buttonThemes[index] ?? buttonThemes[buttonThemes.length - 1];
          return (
            <Button
              key={block.id || index}
              url={block.attributes?.url}
              content={block.attributes?.content}
              className={`
                w-full flex items-center justify-center
                px-7 py-5
                border-2 ${theme.border} ${theme.bg} ${theme.hover}
                font-cinzel uppercase tracking-[2.5px] font-normal text-base lg:text-lg
                ${theme.text}
                transition-all duration-300
                rounded-lg
                group
              `}
            />
          );
        })}
      </div>
    </section>
  );
};
