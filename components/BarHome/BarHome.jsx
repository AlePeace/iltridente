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
          <div className="lg:px-20 pt-5 lg:pt-14 lg:basis-1/2 space-y-5 lg:space-y-10">
            <div className="space-y-2">
              {titleCocktail && (
                <div className="flex gap-3 items-center lg:-ml-10">
                  <div>
                    <svg
                      width="27"
                      height="27"
                      viewBox="0 0 27 27"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.79883 24.1924H17.5961"
                        stroke="#A61932"
                        strokeWidth="2.19931"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7.69922 10.9966H18.6958"
                        stroke="#A61932"
                        strokeWidth="2.19931"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M13.1973 16.4949V24.1925"
                        stroke="#A61932"
                        strokeWidth="2.19931"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M13.1975 16.4948C14.6557 16.4948 16.0542 15.9155 17.0854 14.8843C18.1165 13.8532 18.6958 12.4547 18.6958 10.9965C18.6958 8.79716 18.146 6.59784 16.4965 2.19922H9.89853C8.24905 6.59784 7.69922 8.79716 7.69922 10.9965C7.69922 12.4547 8.2785 13.8532 9.30963 14.8843C10.3408 15.9155 11.7393 16.4948 13.1975 16.4948Z"
                        stroke="#A61932"
                        strokeWidth="2.19931"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
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
                <div className="flex items-center gap-3 lg:-ml-9">
                  <div>
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 22 22"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clipPath="url(#clip0_117_3176)">
                        <g clipPath="url(#clip1_117_3176)">
                          <path
                            d="M10.9966 0C8.82165 0 6.69558 0.644937 4.8872 1.85326C3.07883 3.06157 1.66937 4.779 0.837068 6.78836C0.00476466 8.79772 -0.213004 11.0088 0.211301 13.1419C0.635606 15.275 1.68293 17.2344 3.22082 18.7723C4.75872 20.3102 6.71812 21.3575 8.85125 21.7818C10.9844 22.2061 13.1954 21.9884 15.2048 21.1561C17.2141 20.3238 18.9316 18.9143 20.1399 17.1059C21.3482 15.2976 21.9931 13.1715 21.9931 10.9966C21.99 8.08106 20.8304 5.28587 18.7688 3.2243C16.7073 1.16273 13.9121 0.00315334 10.9966 0V0ZM10.9966 20.1604C9.18414 20.1604 7.41241 19.6229 5.90543 18.616C4.39845 17.6091 3.22391 16.1779 2.53032 14.5034C1.83673 12.8289 1.65526 10.9864 2.00885 9.20879C2.36243 7.43119 3.2352 5.79836 4.51678 4.51678C5.79836 3.2352 7.4312 2.36243 9.2088 2.00884C10.9864 1.65525 12.8289 1.83673 14.5034 2.53031C16.1779 3.2239 17.6091 4.39845 18.616 5.90543C19.6229 7.41241 20.1604 9.18414 20.1604 10.9966C20.1577 13.4261 19.1914 15.7554 17.4734 17.4734C15.7554 19.1914 13.4261 20.1577 10.9966 20.1604ZM12.8293 10.9966C12.8308 11.3186 12.7473 11.6354 12.5874 11.9149C12.4275 12.1945 12.1967 12.427 11.9183 12.5889C11.64 12.7509 11.3238 12.8367 11.0018 12.8376C10.6797 12.8385 10.3631 12.7545 10.0838 12.5941C9.80452 12.4337 9.57244 12.2026 9.41093 11.9239C9.24942 11.6453 9.1642 11.329 9.16383 11.0069C9.16346 10.6849 9.24797 10.3684 9.40884 10.0894C9.56972 9.81037 9.80127 9.57868 10.0802 9.41764V6.41466C10.0802 6.17162 10.1767 5.93854 10.3486 5.76668C10.5204 5.59483 10.7535 5.49828 10.9966 5.49828C11.2396 5.49828 11.4727 5.59483 11.6445 5.76668C11.8164 5.93854 11.9129 6.17162 11.9129 6.41466V9.41764C12.1907 9.57737 12.4216 9.80733 12.5825 10.0845C12.7433 10.3616 12.8284 10.6761 12.8293 10.9966Z"
                            fill="#A61932"
                          />
                        </g>
                      </g>
                      <defs>
                        <clipPath id="clip0_117_3176">
                          <rect width="21.9931" height="21.9931" fill="white" />
                        </clipPath>
                        <clipPath id="clip1_117_3176">
                          <rect width="21.9931" height="21.9931" fill="white" />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
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
              <div className="lg:-ml-5 flex gap-2 items-center group">
                <Buttons blocks={buttons.innerBlocks} variant="cards" />
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#1d239d"
                  strokeWidth="2"
                  className="group-hover:translate-x-2 duration-300 transition-all group-hover:stroke-red"
                >
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
