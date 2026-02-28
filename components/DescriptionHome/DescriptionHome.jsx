import { Buttons } from "components/Buttons";
import { Heading } from "components/Heading";
import { Paragraph } from "components/Paragraph";

export const DescriptionHome = ({ blocks }) => {
  const innerBlocks = blocks?.innerBlocks || [];
  const heading = innerBlocks.find((block) => block.name === "core/heading");
  const paragraph = innerBlocks.find(
    (block) => block.name === "core/paragraph",
  );
  const buttons = innerBlocks.find((block) => block.name === "core/buttons");
  return (
    <section className="py-12 lg:py-24 px-5 relative">
      <div className="absolute top-10 lg:top-16 left-0 w-1/2 lg:w-1/4">
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
      {heading && (
        <div className="relative">
          <Heading
            level={heading.attributes?.level}
            content={heading.attributes?.content}
            className="uppercase font-cinzel text-4xl font-normal text-red text-center"
          />
        </div>
      )}
      {paragraph && (
        <div className="pt-6 lg:pt-10 max-w-5xl mx-auto text-center text-gray-700 font-nunito text-lg">
          <Paragraph
            content={paragraph.attributes?.content}
            className="font-nunito text-lg text-gray-700 font-light text-center"
          />
        </div>
      )}
      {buttons && (
        <div className="pt-6 lg:pt-10 w-full flex justify-center items-center">
          <Buttons blocks={buttons.innerBlocks} variant="border" />
        </div>
      )}
    </section>
  );
};
