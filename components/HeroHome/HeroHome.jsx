"use client";

import { Heading } from "components/Heading";

export const HeroHome = ({ blocks }) => {
  const innerBlocks = blocks?.innerBlocks || [];
  const heading = innerBlocks.find((block) => block.name === "core/heading");
  return (
    <section>
      {heading && (
        <Heading
          level={heading.attributes?.level}
          content={heading.attributes?.content}
          className="font-normal text-5xl lg:text-6xl xl:text-7xl text-peach mt-10"
        />
      )}
    </section>
  );
};
