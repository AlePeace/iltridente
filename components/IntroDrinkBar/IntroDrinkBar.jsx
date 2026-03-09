"use client";

import { Buttons } from "components/Buttons";
import { GuestplanButton } from "components/GuestplanButton";
import { Heading } from "components/Heading";
import { Paragraph } from "components/Paragraph";
import Image from "next/image";

export const IntroDrinkBar = ({ blocks }) => {
  const innerBlocks = blocks?.innerBlocks || [];
  const image = innerBlocks.find((block) => block.name === "core/image");
  const headings = innerBlocks.filter((block) => block.name === "core/heading");
  const paragraph = innerBlocks.find(
    (block) => block.name === "core/paragraph",
  );
  const buttons = innerBlocks.filter((block) => block.name === "core/buttons");

  const titleSection = headings[0];
  const titleOpenHours = headings[1];

  const buttonMenu = buttons[0];
  const buttonPrenota = buttons[1];

  return (
    <section id="dinner" className="pb-10 lg:pb-20 max-w-7xl mx-auto">
      <div className="px-5 lg:px-20">
        <div className="flex flex-col gap-5 lg:flex-row lg:gap-20 items-center">
          {image && (
            <div className="lg:order-last overflow-hidden rounded-xl">
              <Image
                width={image.attributes?.width || 500}
                height={image.attributes?.height || 500}
                src={image.attributes?.url}
                alt={image.attributes?.alt || ""}
                quality={100}
                className="object-cover h-full transform-gpu will-change-transform pointer-events-none aspect-square"
              />
            </div>
          )}
          <div className="lg:order-first flex flex-col gap-5 lg:gap-10">
            {titleSection && (
              <div>
                <Heading
                  level={titleSection.attributes?.level}
                  content={titleSection.attributes?.content}
                  className="font-cinzel uppercase text-ocean font-normal text-3xl"
                />
              </div>
            )}
            {paragraph && (
              <div>
                <Paragraph
                  content={paragraph.attributes?.content}
                  className="font-nunito text-text font-light text-base lg:text-lg"
                />
              </div>
            )}
            {titleOpenHours && (
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
                      stroke="#0080ad"
                      strokeWidth="2.19931"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <Heading
                  level={titleOpenHours.attributes?.level}
                  content={titleOpenHours.attributes?.content}
                  className="font-nunito text-text font-medium text-base"
                />
              </div>
            )}
            <div className="flex gap-5">
              {buttonMenu && (
                <div className="hidden">
                  <Buttons
                    blocks={buttonMenu.innerBlocks}
                    variant="menu"
                    onClick={() => {
                      const accordionEl =
                        document.querySelector(".accordion-bar");
                      if (accordionEl) {
                        // Apre l'accordion cliccando il button interno
                        const trigger = accordionEl.querySelector("button");
                        const isAlreadyOpen =
                          trigger?.getAttribute("aria-expanded") === "true";
                        if (!isAlreadyOpen) trigger?.click();

                        // Scroll con offset per averlo quasi in cima
                        setTimeout(() => {
                          const top =
                            accordionEl.getBoundingClientRect().top +
                            window.scrollY -
                            80;
                          window.scrollTo({ top, behavior: "smooth" });
                        }, 100);
                      }
                    }}
                  />
                </div>
              )}
              {buttonPrenota && (
                <GuestplanButton
                  className="w-fit"
                  innerBlocks={buttonPrenota.innerBlocks}
                  variant="full"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
