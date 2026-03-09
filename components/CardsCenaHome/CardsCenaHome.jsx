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
          <div className="flex gap-3 items-center">
            <div>
              <svg
                width="27"
                height="27"
                viewBox="0 0 27 27"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.0763 13.7302C22.9732 15.6394 22.3194 17.4778 21.1938 19.0233C20.0682 20.5688 18.519 21.7552 16.7335 22.439C14.948 23.1228 13.0027 23.2748 11.1327 22.8766C9.26266 22.4785 7.548 21.5472 6.19598 20.1953C4.84396 18.8434 3.91247 17.1288 3.51409 15.2589C3.11572 13.3889 3.26753 11.4435 3.95116 9.65799C4.6348 7.87245 5.821 6.32314 7.36636 5.19737C8.91173 4.07159 10.7501 3.41754 12.6593 3.31428C13.1046 3.29008 13.3377 3.82012 13.1013 4.1973C12.3105 5.46251 11.9719 6.95839 12.1408 8.44082C12.3096 9.92325 12.9759 11.3047 14.0309 12.3597C15.0859 13.4147 16.4673 14.081 17.9498 14.2498C19.4322 14.4186 20.9281 14.08 22.1933 13.2893C22.5716 13.0528 23.1005 13.2849 23.0763 13.7302Z"
                  stroke="#CAD5E2"
                  strokeWidth="2.19931"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
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
          <div className="flex items-center gap-2 group">
            <Buttons blocks={buttons.innerBlocks} variant="cardsNight" />
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              className="group-hover:translate-x-2 duration-300 transition-all group-hover:stroke-red"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </div>
        )}
      </div>
    </section>
  );
};
