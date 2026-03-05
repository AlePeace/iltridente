import { Buttons } from "components/Buttons";
import { GuestplanButton } from "components/GuestplanButton";
import { Heading } from "components/Heading";
import { Paragraph } from "components/Paragraph";
import Image from "next/image";

export const IntroPranzoRisto = ({ blocks }) => {
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
    <section className="pb-10 lg:pb-20 max-w-7xl mx-auto">
      <div className="px-5 lg:px-32">
        <div className="flex flex-col gap-5 lg:flex-row lg:gap-20 items-center">
          {image && (
            <div className="overflow-hidden rounded-xl">
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
          <div className="flex flex-col gap-5 lg:gap-10">
            {titleSection && (
              <div>
                <Heading
                  level={titleSection.attributes?.level}
                  content={titleSection.attributes?.content}
                  className="font-cinzel uppercase text-red font-normal text-3xl"
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
                      d="M13.1955 17.5945C15.6248 17.5945 17.5941 15.6252 17.5941 13.1959C17.5941 10.7666 15.6248 8.79724 13.1955 8.79724C10.7662 8.79724 8.79688 10.7666 8.79688 13.1959C8.79688 15.6252 10.7662 17.5945 13.1955 17.5945Z"
                      stroke="#A61932"
                      strokeWidth="2.19931"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.1953 2.19934V4.39865"
                      stroke="#A61932"
                      strokeWidth="2.19931"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M13.1953 21.9932V24.1925"
                      stroke="#A61932"
                      strokeWidth="2.19931"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.41992 5.42139L6.97044 6.9719"
                      stroke="#A61932"
                      strokeWidth="2.19931"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M19.4199 19.4199L20.9704 20.9704"
                      stroke="#A61932"
                      strokeWidth="2.19931"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2.19922 13.1959H4.39853"
                      stroke="#A61932"
                      strokeWidth="2.19931"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21.9922 13.1959H24.1915"
                      stroke="#A61932"
                      strokeWidth="2.19931"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6.97044 19.4199L5.41992 20.9704"
                      stroke="#A61932"
                      strokeWidth="2.19931"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M20.9704 5.42139L19.4199 6.9719"
                      stroke="#A61932"
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
                <Buttons blocks={buttonMenu.innerBlocks} variant="menu" />
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
