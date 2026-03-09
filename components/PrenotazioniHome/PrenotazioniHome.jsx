import { Buttons } from "components/Buttons";
import { GuestplanButton } from "components/GuestplanButton";
import { Heading } from "components/Heading";
import { Paragraph } from "components/Paragraph";
import Image from "next/image";

export const PrenotazioniHome = ({ blocks }) => {
  const innerBlocks = blocks?.innerBlocks || [];
  const heading = innerBlocks.find((block) => block.name === "core/heading");
  const paragraph = innerBlocks.find(
    (block) => block.name === "core/paragraph",
  );
  const buttons = innerBlocks.find((block) => block.name === "core/buttons");
  const image = innerBlocks.find((block) => block.name === "core/image");

  return (
    <section className="py-12 lg:py-24 px-5 relative bg-red/5">
      {image && (
        <div className="absolute bottom-0 left-0 w-full">
          <Image
            width={image.attributes?.width || 1920}
            height={image.attributes?.height || 1080}
            src={image.attributes?.url}
            alt={image.attributes?.alt || ""}
            quality={100}
            className="w-full h-full lg:max-h-96 will-change-transform transform-gpu pointer-events-none"
          />
        </div>
      )}
      {heading && (
        <div className="relative">
          <Heading
            level={heading.attributes?.level}
            content={heading.attributes?.content}
            className="uppercase font-cinzel text-2xl font-normal text-red text-center"
          />
        </div>
      )}
      {paragraph && (
        <div className="relative pt-6 lg:pt-10 max-w-5xl mx-auto text-center text-gray-700 font-nunito text-lg">
          <Paragraph
            content={paragraph.attributes?.content}
            className="font-nunito text-lg text-text font-light text-center"
          />
        </div>
      )}
      {buttons && (
        <div className="relative pt-6 lg:pt-10 w-full flex justify-center items-center">
          <GuestplanButton innerBlocks={buttons.innerBlocks} variant="border" />
        </div>
      )}
    </section>
  );
};
