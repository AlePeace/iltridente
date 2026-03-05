"use client";

import { Buttons } from "components/Buttons";

export const GuestplanButton = ({ innerBlocks, variant, className = "" }) => {
  return (
    <div
      onClick={() => window._gstpln?.openWidget()}
      className={className || "pt-6 lg:pt-10 w-full flex justify-center items-center"}
    >
      <Buttons blocks={innerBlocks} variant={variant} />
    </div>
  );
};
