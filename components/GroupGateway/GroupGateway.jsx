"use client";

import { Heading } from "components/Heading";
import { Paragraph } from "components/Paragraph";
import Image from "next/image";

export const GroupGateway = ({ blocks }) => {
  const innerBlocks = blocks?.innerBlocks || [];
  const image = innerBlocks.find((block) => block.name === "core/image");
  const heading = innerBlocks.find((block) => block.name === "core/heading");
  const paragraph = innerBlocks.find(
    (block) => block.name === "core/paragraph",
  );

  return (
    <section className="py-12 lg:py-24 max-w-7xl mx-auto px-5 lg:px-20">
      <div className="flex flex-col items-center gap-8 lg:gap-12">
        {image && (
          <div className="flex justify-center overflow-hidden rounded-xl">
            <Image
              width={image.attributes?.width || 600}
              height={image.attributes?.height || 400}
              src={image.attributes?.url}
              alt={image.attributes?.alt || ""}
              quality={100}
              className="object-cover transform-gpu will-change-transform pointer-events-none"
            />
          </div>
        )}
        {heading && (
          <Heading
            level={heading.attributes?.level}
            content={heading.attributes?.content}
            className="font-cinzel uppercase text-red font-normal text-3xl lg:text-4xl tracking-wider text-center"
          />
        )}
        {paragraph && (
          <Paragraph
            content={paragraph.attributes?.content}
            className="font-nunito text-text font-light text-base lg:text-lg text-center max-w-2xl"
          />
        )}
      </div>
      <style>
        {`
          header{
          display: none;
          }
        `}
      </style>
    </section>
  );
};
