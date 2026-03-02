import { Buttons } from "components/Buttons";
import { Heading } from "components/Heading";
import { Paragraph } from "components/Paragraph";
import Image from "next/image";

export const CardsCenaHome = ({ blocks }) => {
  const innerBlocks = blocks?.innerBlocks || [];
  const image = innerBlocks.find((block) => block.name === "core/image");
  const headings = innerBlocks.filter((block) => block.name === "core/heading");
  const title = headings[1];
  const subtitle = headings[0];
  const paragraphs = innerBlocks.find(
    (block) => block.name === "core/paragraph",
  );
  const buttons = innerBlocks.find((block) => block.name === "core/buttons");

  return (
    <section className="lg:flex">
      {image && (
        <div className="lg:basis-1/2 lg:order-last">
          <Image
            width={image.attributes?.width || 1920}
            height={image.attributes?.height || 1080}
            src={image.attributes?.url}
            alt={image.attributes?.alt || ""}
            quality={100}
            className="w-full h-full object-cover will-change-transform pointer-events-none !aspect-4/3 lg:aspect-auto"
          />
        </div>
      )}
      <div className="py-10 lg:py-32 px-5 lg:px-20 flex flex-col gap-5 lg:gap-8 justify-center items-start bg-ocean lg:basis-1/2 lg:order-first">
        {subtitle && (
          <div>
            <Heading
              level={subtitle.attributes?.level}
              content={subtitle.attributes?.content}
              className="text-borderbutton uppercase font-nunito text-xs"
            />
          </div>
        )}
        {title && (
          <div>
            <Heading
              level={title.attributes?.level}
              content={title.attributes?.content}
              className="text-pink uppercase font-cinzel text-xl lg:text-4xl font-normal"
            />
          </div>
        )}
        {paragraphs && (
          <div>
            <Paragraph
              content={paragraphs.attributes?.content}
              className="text-borderbutton font-nunito text-xs lg:text-lg"
            />
          </div>
        )}
        {buttons && (
          <div>
            <Buttons blocks={buttons.innerBlocks} variant="cardsNight" />
          </div>
        )}
      </div>
    </section>
  );
};
