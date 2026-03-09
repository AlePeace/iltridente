import { Buttons } from "components/Buttons";
import { Heading } from "components/Heading";
import { Paragraph } from "components/Paragraph";
import Image from "next/image";

export const CardsPranzoHome = ({ blocks }) => {
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
      <div className="py-10 lg:py-32 px-5 lg:px-20 flex flex-col gap-5 lg:gap-8 justify-center items-start bg-cardspranzo lg:basis-1/2">
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
                  d="M13.1955 17.5945C15.6248 17.5945 17.5941 15.6252 17.5941 13.1959C17.5941 10.7666 15.6248 8.79724 13.1955 8.79724C10.7662 8.79724 8.79688 10.7666 8.79688 13.1959C8.79688 15.6252 10.7662 17.5945 13.1955 17.5945Z"
                  stroke="#a61932"
                  strokeWidth="2.19931"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.1953 2.19934V4.39865"
                  stroke="#a61932"
                  strokeWidth="2.19931"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.1953 21.9932V24.1925"
                  stroke="#a61932"
                  strokeWidth="2.19931"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M5.41992 5.42139L6.97044 6.9719"
                  stroke="#a61932"
                  strokeWidth="2.19931"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M19.4199 19.4199L20.9704 20.9704"
                  stroke="#a61932"
                  strokeWidth="2.19931"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.19922 13.1959H4.39853"
                  stroke="#a61932"
                  strokeWidth="2.19931"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21.9922 13.1959H24.1915"
                  stroke="#a61932"
                  strokeWidth="2.19931"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M6.97044 19.4199L5.41992 20.9704"
                  stroke="#a61932"
                  strokeWidth="2.19931"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M20.9704 5.42139L19.4199 6.9719"
                  stroke="#a61932"
                  strokeWidth="2.19931"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <Heading
              level={subtitle.attributes?.level}
              content={subtitle.attributes?.content}
              className="text-dust uppercase font-nunito text-xs"
            />
          </div>
        )}
        {title && (
          <div>
            <Heading
              level={title.attributes?.level}
              content={title.attributes?.content}
              className="text-red uppercase font-cinzel text-xl lg:text-4xl font-normal"
            />
          </div>
        )}
        {paragraphs && (
          <div>
            <Paragraph
              content={paragraphs.attributes?.content}
              className="text-text font-nunito text-xs lg:text-lg"
            />
          </div>
        )}
        {buttons && (
          <div className="flex items-center gap-2 group">
            <Buttons blocks={buttons.innerBlocks} variant="cards" />
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
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
