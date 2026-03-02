"use client";

import { Buttons } from "components/Buttons";

export const GuestplanButton = ({ innerBlocks }) => {
  return (
    <div
      onClick={() => window._gstpln?.openWidget()}
      className="pt-6 lg:pt-10 w-full flex justify-center items-center"
    >
      <Buttons blocks={innerBlocks} variant="border" />
    </div>
  );
};
