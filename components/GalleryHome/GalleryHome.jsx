import Image from "next/image";

export const GalleryHome = ({ blocks }) => {
  const innerBlocks = blocks?.innerBlocks || [];
  const image = innerBlocks.filter((block) => block.name === "core/image");
  const image1 = image[0];
  const image2 = image[1];
  const image3 = image[2];
  const image4 = image[3];

  return (
    <section className="py-10 lg:py-20 pl-5 lg:pl-10 grid grid-cols-2 lg:grid-cols-5 lg:gap-5">
      {image1 && (
        <div className="lg:col-span-1 pr-2">
          <Image
            width={image1.attributes?.width || 1920}
            height={image1.attributes?.height || 1080}
            src={image1.attributes?.url}
            alt={image1.attributes?.alt || ""}
            quality={100}
            className="w-full h-full object-cover will-change-transform transform-gpu pointer-events-none"
          />
        </div>
      )}
      {image2 && (
        <div className="lg:col-span-2 translate-y-5 lg:translate-y-10">
          <Image
            width={image2.attributes?.width || 1920}
            height={image2.attributes?.height || 1080}
            src={image2.attributes?.url}
            alt={image2.attributes?.alt || ""}
            quality={100}
            className="w-full h-full object-cover will-change-transform transform-gpu lg:!aspect-square pointer-events-none"
          />
        </div>
      )}
      {image3 && (
        <div className="hidden lg:block lg:col-span-1">
          <Image
            width={image3.attributes?.width || 1920}
            height={image3.attributes?.height || 1080}
            src={image3.attributes?.url}
            alt={image3.attributes?.alt || ""}
            quality={100}
            className="w-full h-full object-cover will-change-transform transform-gpu pointer-events-none"
          />
        </div>
      )}
      {image4 && (
        <div className="hidden lg:block lg:col-span-1 translate-y-5 lg:translate-y-10">
          <Image
            width={image4.attributes?.width || 1920}
            height={image4.attributes?.height || 1080}
            src={image4.attributes?.url}
            alt={image4.attributes?.alt || ""}
            quality={100}
            className="w-full h-full object-cover will-change-transform transform-gpu pointer-events-none"
          />
        </div>
      )}
    </section>
  );
};
