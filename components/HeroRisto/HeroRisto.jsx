import { Heading } from "components/Heading";
import Image from "next/image";
import Link from "next/link";

const ImageWithLink = ({ imgBlock, ...imageProps }) => {
  const href = imgBlock?.attributes?.href;
  const linkTarget = imgBlock?.attributes?.linkTarget || "_self";

  const imageElement = (
    <div className="h-full relative">
        <Image
          width={imgBlock?.attributes?.width || 1920}
          height={imgBlock?.attributes?.height || 1080}
          src={imgBlock?.attributes?.url}
          alt={imgBlock?.attributes?.alt || ""}
          quality={100}
          priority
          fetchPriority="high"
          className="w-full h-full object-cover"
        />
    </div>
  );

  if (href) {
    return (
      <Link href={href} target={linkTarget} className="relative w-full h-full block cursor-pointer">
        {imageElement}
      </Link>
    );
  }

  return imageElement;
};

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
          {imgLunch && <ImageWithLink imgBlock={imgLunch} />}
          <div className="absolute bottom-0 flex justify-end items-end">
            {headingLunch && (
              <Heading
                level={headingLunch.attributes?.level}
                content={headingLunch.attributes?.content}
                className="uppercase tracking-[2.4px] font-nunito text-xs font-light text-white text-center"
              />
            )}
          </div>
        </div>
        <div className="relative h-[33vh] lg:basis-1/3 lg:h-[70vh]">
          {imgDinner && <ImageWithLink imgBlock={imgDinner} />}
          <div className="absolute bottom-0 flex justify-end items-end">
            {headingDinner && (
              <Heading
                level={headingDinner.attributes?.level}
                content={headingDinner.attributes?.content}
                className="uppercase tracking-[2.4px] font-nunito text-xs font-light text-white text-center"
              />
            )}
          </div>
        </div>
        <div className="relative h-[33vh] lg:basis-1/3 lg:h-[70vh]">
          {imgBreakfast && <ImageWithLink imgBlock={imgBreakfast} />}
          <div className="absolute bottom-0 flex justify-end items-end">
            {headingBreakfast && (
              <Heading
                level={headingBreakfast.attributes?.level}
                content={headingBreakfast.attributes?.content}
                className="uppercase tracking-[2.4px] font-nunito text-xs font-light text-white text-center"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
