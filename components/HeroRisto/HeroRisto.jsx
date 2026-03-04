import { Heading } from "components/Heading";
import Image from "next/image";

export const HeroRisto = ({ blocks }) => {
  const innerBlocks = blocks?.innerBlocks || [];
  const images = innerBlocks.filter((block) => block.name === "core/image");
  const imgLunch = images[0];
  const imgDinner = images[1];
  const imgBreakfast = images[2];

  const headings = innerBlocks.filter((block) => block.name === "core/heading");
  const headingLunch = headings[0];
  const headingDinner = headings[1];
  const headingBreakfast = headings[2];

  return (
    <section>
      <div className="h-screen lg:h-[70vh] w-full flex flex-col lg:flex-row">
        <div className="relative h-[33vh] lg:basis-1/3 lg:h-[70vh]">
          {imgLunch && (
            <div className="h-full relative">
              <Image
                width={imgLunch?.attributes?.width || 1920}
                height={imgLunch?.attributes?.height || 1080}
                src={imgLunch?.attributes?.url}
                alt={imgLunch?.attributes?.alt || ""}
                quality={100}
                priority
                fetchPriority="high"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#A86F79] to-transparent mix-blend-multiply"></div>
            </div>
          )}
          <div className="absolute w-full bottom-10 flex justify-center items-end">
            {headingLunch && (
              <Heading
                level={headingLunch.attributes?.level}
                content={headingLunch.attributes?.content}
                className="uppercase tracking-[2.4px] font-cinzel text-xl font-light text-white text-center"
              />
            )}
          </div>
        </div>
        <div className="relative h-[33vh] lg:basis-1/3 lg:h-[70vh]">
          {imgDinner && (
            <div className="h-full relative">
              <Image
                width={imgDinner?.attributes?.width || 1920}
                height={imgDinner?.attributes?.height || 1080}
                src={imgDinner?.attributes?.url}
                alt={imgDinner?.attributes?.alt || ""}
                quality={100}
                priority
                fetchPriority="high"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#A86F79] to-transparent mix-blend-multiply"></div>
            </div>
          )}
          <div className="absolute w-full bottom-10 flex justify-center items-end">
            {headingDinner && (
              <Heading
                level={headingDinner.attributes?.level}
                content={headingDinner.attributes?.content}
                className="uppercase tracking-[2.4px] font-cinzel text-xl font-light text-white text-center"
              />
            )}
          </div>
        </div>
        <div className="relative h-[33vh] lg:basis-1/3 lg:h-[70vh]">
          {imgBreakfast && (
            <div className="h-full relative">
              <Image
                width={imgBreakfast?.attributes?.width || 1920}
                height={imgBreakfast?.attributes?.height || 1080}
                src={imgBreakfast?.attributes?.url}
                alt={imgBreakfast?.attributes?.alt || ""}
                quality={100}
                priority
                fetchPriority="high"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#A86F79] to-transparent mix-blend-multiply"></div>
            </div>
          )}
          <div className="absolute w-full bottom-10 flex justify-center items-end">
            {headingBreakfast && (
              <div>
                <Heading
                  level={headingBreakfast.attributes?.level}
                  content={headingBreakfast.attributes?.content}
                  className="uppercase tracking-[2.4px] font-cinzel text-xl font-light text-white text-center"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
