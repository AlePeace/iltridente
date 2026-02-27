import Image from "next/image";
import { Heading } from "components/Heading";
import { Paragraph } from "components/Paragraph";
import { Buttons } from "components/Buttons";

export const VillaHome = ({ blocks }) => {
  const innerBlocks = blocks?.innerBlocks || [];

  const headings = innerBlocks.filter((b) => b.name === "core/heading");
  const paragraph = innerBlocks.find((b) => b.name === "core/paragraph");
  const buttons = innerBlocks.find((b) => b.name === "core/buttons");
  const images = innerBlocks.filter((b) => b.name === "core/image");
  const imgStrip = images[0]?.attributes;
  const imgMain = images[1]?.attributes || images[0]?.attributes;
  const imgBreakfast = images[2]?.attributes;
  const imgBed = images[3]?.attributes;
  const imgBottom = images[4]?.attributes || images[1]?.attributes;

  const topHeading = headings[0];
  const bottomHeading = headings[1];

  return (
    <section className="relative z-20 w-full h-full bg-linear-to-b pt-10 lg:pt-32 px-5 lg:px-40 from-white to-gradientbrown overflow-hidden">
      <div className="absolute right-0 lg:right-20 xl:right-40 z-0 top-1/4 h-[50%] w-1/2 lg:w-1/3 bg-peach"></div>
      <div className="absolute w-full top-0 left-0 px-10 pt-10 lg:pt-32 flex items-center justify-center">
        <svg
          className="w-4/6 h-auto"
          width="820"
          height="1797"
          viewBox="0 0 820 1797"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width="820" height="1797" />
          <path
            d="M565.682 664.396C489.165 675.116 457.888 801.837 457.888 738.583C457.888 557.836 790.8 659.355 790.8 409.178C790.8 328.53 737.038 239.86 618.169 239.86H589.308C535.411 239.86 487.555 276.563 470.909 330.802L410.434 652.54L349.96 330.802C333.247 276.563 285.458 239.86 231.561 239.86H202.699C83.7637 239.86 30.001 328.459 30.001 409.178C30.001 659.355 362.914 557.907 362.914 738.583C362.914 801.766 331.435 676.323 255.12 664.396C52.5531 632.591 35.3034 872.404 35.3034 872.404H241.427C323.917 872.404 380.499 866.654 410.367 811.705C440.235 866.583 496.884 872.404 579.307 872.404H785.431C785.431 872.404 771.604 635.502 565.615 664.325L565.682 664.396Z"
            fill="#EE954C08"
          />
          <path
            d="M410.4 268.199C410.4 181.184 366.254 134.099 284.863 134.099C366.321 134.099 410.4 86.9427 410.4 0C410.4 87.0142 454.545 134.099 535.937 134.099C454.478 134.099 410.4 181.256 410.4 268.199Z"
            fill="#EE954C08"
          />
          <path
            d="M255.118 1132.21C331.634 1121.49 362.912 994.767 362.912 1058.02C362.912 1238.77 29.9994 1137.25 29.9994 1387.43C29.9994 1468.07 83.7621 1556.74 202.631 1556.74L231.492 1556.74C285.389 1556.74 333.245 1520.04 349.891 1465.8L410.366 1144.06L470.84 1465.8C487.553 1520.04 535.342 1556.74 589.239 1556.74L618.1 1556.74C737.036 1556.74 790.799 1468.15 790.799 1387.43C790.799 1137.25 457.886 1238.7 457.886 1058.02C457.886 994.838 489.365 1120.28 565.68 1132.21C768.247 1164.01 785.496 924.2 785.496 924.2L579.372 924.2C496.883 924.2 440.301 929.951 410.433 984.899C380.565 930.022 323.916 924.2 241.493 924.2L35.3689 924.2C35.3689 924.2 49.1955 1161.1 255.185 1132.28L255.118 1132.21Z"
            fill="#EE954C08"
          />
          <path
            d="M410.399 1528.41C410.399 1615.42 454.544 1662.51 535.936 1662.51C454.477 1662.51 410.399 1709.66 410.399 1796.61C410.399 1709.59 366.253 1662.51 284.862 1662.51C366.32 1662.51 410.399 1615.35 410.399 1528.41Z"
            fill="#EE954C08"
          />
        </svg>
      </div>
      <div className="relative z-10">
        {topHeading && (
          <Heading
            level={topHeading.attributes?.level}
            content={topHeading.attributes?.content}
            className="font-montecatini font-normal text-5xl lg:text-6xl xl:text-7xl text-blue"
          />
        )}
      </div>
      <div className="relative z-10 w-full flex flex-col lg:flex-row pt-10 lg:pt-20">
        <div className="lg:basis-1/2">
          <div className="pl-7 md:pr-12 lg:pr-24 border-l border-gray/30">
            {paragraph && (
              <Paragraph
                content={paragraph.attributes?.content}
                className="font-nunito font-light text-gray text-base lg:text-lg xl:text-xl"
              />
            )}
          </div>
        </div>
        <div className="lg:basis-1/2">
          <div className="relative w-full pt-10 lg:pt-0 lg:-mt-20 flex justify-end">
            <Image
              src={imgStrip.url}
              alt={imgStrip.alt || "Image"}
              className={`object-cover w-[${imgStrip.width}px] h-[${imgStrip.height}px] aspect-[${imgStrip.width}/${imgStrip.height}] scale-[60%] lg:scale-75 origin-top-right translate-x-5 lg:translate-x-40 pointer-events-none will-change-transform`}
              width={imgStrip.width}
              height={imgStrip.height}
              priority
            />
            <div className="absolute top-1/2 -translate-x-1/4 lg:-translate-x-20 -translate-y-2/3">
              <Image
                src={imgMain.url}
                alt={imgMain.alt || "Image"}
                className={`object-cover w-[${imgMain.width}px] h-[${imgMain.height}px] aspect-[${imgMain.width}/${imgMain.height}] scale-75 origin-top-right pointer-events-none will-change-transform`}
                width={imgMain.width}
                height={imgMain.height}
                priority
              />
              <div className="absolute bottom-14 lg:bottom-20 xl:bottom-44 -translate-y-1/2 lg:translate-x-1/4 right-0">
                {buttons?.innerBlocks?.length > 0 && (
                  <div className="relative">
                    <Buttons blocks={buttons.innerBlocks} variant="villaHome" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full -ml-5 lg:-ml-40 lg:pt-2">
        <div className="-mt-[90%] lg:-mt-[70%] xl:-mt-[75%] w-2/3 lg:w-[55%] xl:w-1/2">
          <Image
            src={imgBreakfast.url}
            alt={imgBreakfast.alt || "Image"}
            className={`object-cover lg:w-full w-[${imgBreakfast.width}px] h-[${imgBreakfast.height}px] aspect-[${imgBreakfast.width}/${imgBreakfast.height}] pointer-events-none will-change-transform`}
            width={imgBreakfast.width}
            height={imgBreakfast.height}
            priority
          />
        </div>
      </div>
      <div className="w-full">
        <div className="pt-10 lg:flex lg:flex-row lg:gap-20">
          <div className="lg:basis-2/3 xl:basis-1/2">
            <Image
              src={imgBottom.url}
              alt={imgBottom.alt || "Image"}
              className={`object-cover w-2/3 lg:w-full lg:w-[${imgBottom.width}px] lg:h-[${imgBottom.height}px] aspect-[${imgBottom.width}/${imgBottom.height}] pointer-events-none will-change-transform lg:translate-y-[57%] xl:translate-y-20`}
              width={imgBottom.width}
              height={imgBottom.height}
              priority
            />
          </div>
          <div>
            <div className="lg:-mt-[50%] lg:basis-1/2">
              <div className="flex justify-end lg:justify-start items-end -mt-[5%]">
                <Image
                  src={imgBed.url}
                  alt={imgBed.alt || "Image"}
                  className={`object-cover w-2/3 lg:w-full lg:w-[${imgBed.width}px] h-[${imgBed.height}px] aspect-[${imgBed.width}/${imgBed.height}] pointer-events-none will-change-transform`}
                  width={imgBed.width}
                  height={imgBed.height}
                  priority
                />
              </div>
              {bottomHeading && (
                <Heading
                  level={bottomHeading.attributes?.level}
                  content={bottomHeading.attributes?.content}
                  className="font-montecatini font-normal text-5xl lg:text-7xl xl:text-8xl text-lightblue mt-10"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="py-5 w-dvw -mx-5 lg:-mx-40 space-y-1">
        <div className="h-1 bg-white"></div>
        <div className="h-1 bg-white"></div>
      </div>
    </section>
  );
};
