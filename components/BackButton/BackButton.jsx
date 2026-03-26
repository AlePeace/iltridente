"use client";

import { Button } from "components/Button";

export const BackButton = ({ blocks }) => {
  const innerBlocks = blocks?.innerBlocks || [];
  const buttonBlock =
    innerBlocks.find((b) => b.name === "core/button") ??
    innerBlocks
      .find((b) => b.name === "core/buttons")
      ?.innerBlocks?.find((b) => b.name === "core/button");

  if (!buttonBlock) return null;

  return (
    <div className="max-w-7xl mx-auto flex justify-center px-5 lg:px-20 pt-8">
      <Button
        url={buttonBlock.attributes?.url}
        content={buttonBlock.attributes?.content}
        className="inline-flex items-center gap-2 px-8 py-3 font-nunito uppercase tracking-[3px] text-sm border border-red text-red bg-transparent transition-all duration-300 hover:bg-red hover:text-white"
      />
    </div>
  );
};
