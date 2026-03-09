"use client"

import { Button } from "components/Button";

export const Buttons = ({
  blocks,
  className = "",
  variant = "default",
  decoration,
  onClick
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "border":
        return "flex gap-6 justify-center";
      case "cards":
        return "flex justify-start";
      case "default":
      default:
        return "flex gap-4";
    }
  };

  const getButtonStyles = () => {
    if (variant === "border") {
      return "px-10 py-4 font-nunito tracking-[3px] !rounded-none border-[1px] border-borderbutton uppercase bg-transparent text-red font-regular transition-all duration-300 hover:bg-red hover:text-white";
    }

    if (variant === "cards") {
      return "font-nunito !rounded-none bg-transparent text-black font-regular text-xs underline lg:text-base transition-all duration-300 hover:text-red";
    }

    if (variant === "cardsNight") {
      return "font-nunito !rounded-none bg-transparent text-white font-regular text-xs underline lg:text-base transition-all duration-300 hover:text-red";
    }

    if (variant === "menu") {
      return "px-10 py-2 font-nunito tracking-[3px] !rounded-none border-[1px] border-red uppercase bg-transparent text-red font-regular transition-all duration-300 hover:bg-red hover:text-white after:content-['↓'] after:ml-2 after:inline-block after:transition-transform after:duration-300 hover:after:translate-y-2";
    }

    if (variant === "full") {
      return "px-10 py-2 font-nunito tracking-[3px] !rounded-none border-[1px] border-red uppercase bg-red text-white font-regular transition-all duration-300 hover:bg-white hover:text-red after:content-['→'] after:ml-2 after:inline-block after:transition-transform after:duration-300 hover:after:translate-x-2";
    }
  };

  return (
    <div className={`${getVariantStyles()} ${className}`}>
      {blocks?.map((block, index) => {
        if (block.name === "core/button") {
          return (
            <Button
              key={block.id || index}
              url={block.attributes.url}
              content={block.attributes.content}
              className={getButtonStyles()}
              onClick={onClick}
            />
          );
        }
        return null;
      })}
      {decoration && (
        <div className="absolute inset-0 pointer-events-none">{decoration}</div>
      )}
    </div>
  );
};
