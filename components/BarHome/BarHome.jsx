import { Buttons } from "components/Buttons";
import { Heading } from "components/Heading";
import { Paragraph } from "components/Paragraph";
import Image from "next/image";

export const BarHome = ({ blocks }) => {
  const innerBlocks = blocks?.innerBlocks || [];
  const headings = innerBlocks.filter((block) => block.name === "core/heading");
  const barLabel = headings[0];
  const titleSection = headings[1];
  const titleCocktail = headings[2];
  const openHour = headings[3];

  const paragraphs = innerBlocks.filter(
    (block) => block.name === "core/paragraph",
  );
  const descriptionSection = paragraphs[0];
  const descriptionCocktail = paragraphs[1];
  const descriptionOpenHour = paragraphs[2];

  const image = innerBlocks.find((block) => block.name === "core/image");
  const buttons = innerBlocks.find((block) => block.name === "core/buttons");

  return (
    <section className="py-10 lg:py-32 relative">
      <div className="absolute top-20 lg:top-66 right-0 w-1/2 lg:w-1/4 -scale-x-100">
        <svg
          id="Livello_1"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 0 333 233.5"
        >
          <path
            className="onde1"
            d="M103.9,193.5c-12,18.7-57.6,34.8-103.9,35v-53.1c74.4,13.5,74.3-31.9,41.9-49.4-33.9-18.4,110.6-8.8,62,67.5Z"
          />
          <path
            className="onde1"
            d="M0,26.3c21.5-8.4,42.9-14.1,62.5-13.8,61.2,1,80.9,51.6,131,60.8,74.8,13.8,74.8-31.7,42.4-49.4-33.9-18.4,110.6-8.8,62,67.5-21.5,33.7-152,58.7-199.2-1.5C74.1,58.7,35.4,56.2,0,62.8V26.3Z"
          />
          <polyline
            className="onde0"
            points="0 -6.5 0 26.3 0 62.8 0 175.5 0 228.5"
          />
        </svg>
      </div> 
      <div className="space-y-10 lg:space-y-14 relative">
        <div className="flex flex-col gap-5 lg:gap-10 justify-center items-center">
          {barLabel && (
            <div className="py-1.5 px-12 bg-ocean/8 rounded-full">
              <Heading
                level={barLabel.attributes?.level}
                content={barLabel.attributes?.content}
                className="text-red uppercase font-normal font-nunito text-xs"
              />
            </div>
          )}
          {titleSection && (
            <div>
              <Heading
                level={titleSection.attributes?.level}
                content={titleSection.attributes?.content}
                className="text-ocean uppercase font-normal font-cinzel text-4xl"
              />
            </div>
          )}
          {descriptionSection && (
            <div className="max-w-2xl">
              <Paragraph
                content={descriptionSection.attributes?.content}
                className="font-nunito font-light text-text text-center text-base lg:text-lg"
              />
            </div>
          )}
        </div>
        <div className="px-5 lg:px-20 lg:flex lg:items-center">
          {image && (
            <div className="lg:basis-1/2">
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
          <div className="lg:px-20 lg:pt-14 lg:basis-1/2 space-y-5 lg:space-y-10">
            <div className="space-y-2">
              {titleCocktail && (
                <div>
                  <Heading
                    level={titleCocktail.attributes?.level}
                    content={titleCocktail.attributes?.content}
                    className="text-text font-normal font-nunito text-base lg:text-lg"
                  />
                </div>
              )}
              {descriptionCocktail && (
                <div>
                  <Paragraph
                    content={descriptionCocktail.attributes?.content}
                    className="font-nunito font-light text-text text-sm lg:text-base"
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              {openHour && (
                <div>
                  <Heading
                    level={openHour.attributes?.level}
                    content={openHour.attributes?.content}
                    className="text-text font-normal font-nunito text-base lg:text-lg"
                  />
                </div>
              )}
              {descriptionOpenHour && (
                <div>
                  <Paragraph
                    content={descriptionOpenHour.attributes?.content}
                    className="font-nunito font-light text-text text-sm lg:text-base"
                  />
                </div>
              )}
            </div>
            {buttons && (
              <div className="lg:-ml-5">
                <Buttons blocks={buttons.innerBlocks} variant="cards" />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
