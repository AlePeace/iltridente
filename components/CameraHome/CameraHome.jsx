import { Buttons } from "components/Buttons";
import { Paragraph } from "components/Paragraph";
import Image from "next/image";

export const CameraHome = ({ blocks }) => {
  const innerBlocks = blocks?.innerBlocks || [];
  const paragraphBlock = innerBlocks.find((b) => b.name === "core/paragraph");
  const button = innerBlocks.find((b) => b.name === "core/buttons");
  const img = innerBlocks.find((b) => b.name === "core/image");

  return (
    <section className="w-full px-5 lg:px-10 overflow-hidden">
      <div className="pt-10 xl:pt-20 pl-5 lg:pl-40 w-full lg:w-1/2 xl:w-1/3">
        {paragraphBlock && (
          <div className="pl-7 border-l border-gray/30">
            <Paragraph
              content={paragraphBlock?.attributes?.content}
              className="font-nunito font-light text-gray text-base lg:text-lg xl:text-xl"
            />
          </div>
        )}
      </div>
      <div className="py-10 lg:py-36 px-5 lg:px-10 xl:px-20 relative flex flex-col gap-20 justify-center lg:justify-end items-end">
        {button && <Buttons blocks={button.innerBlocks} variant="CameraHome" />}
        <div className="lg:w-[35%] xl:w-[40%] z-0 lg:-mt-[15%] xl:-mt-[10%]">
          <div className="relative z-10">
            <Image
              src={img?.attributes?.url}
              alt={img?.attributes?.alt || "Camera Home"}
              width={img?.attributes?.width}
              height={img?.attributes?.height}
              className={`object-cover w-[${img?.attributes?.width}px] h-[${img?.attributes?.height}px] aspect-[${img?.attributes?.width}/${img?.attributes?.height}] pointer-events-none will-change-transform relative z-10`}
              priority
            />
            <div className="absolute -inset-10 bg-peach h-[100%]"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
