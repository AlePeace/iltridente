"use client";

import { Buttons } from "components/Buttons";
import { SEASON_CLOSED } from "utils/seasonFlags";

export const GuestplanButton = ({ innerBlocks, variant, className = "" }) => {
  // Chiusura invernale: tutti i bottoni "Prenota" del sito passano da qui.
  if (SEASON_CLOSED) return null;

  return (
    <div
      className={className || "pt-6 lg:pt-10 w-full flex justify-center items-center"}
    >
      <Buttons blocks={innerBlocks} variant={variant} />
    </div>
  );
};
