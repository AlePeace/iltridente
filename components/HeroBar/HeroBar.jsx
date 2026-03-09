import Image from "next/image";

export const HeroBar = ({ blocks }) => {
  const innerBlocks = blocks?.innerBlocks || [];
  const images = innerBlocks.find((block) => block.name === "core/image");

  return (
    <section>
      <div className="h-[70vh] w-full">
        <div className="relative h-[70vh]">
          {images && (
            <div className="h-full relative overflow-hidden">
              <Image
                width={images?.attributes?.width || 1920}
                height={images?.attributes?.height || 1080}
                src={images?.attributes?.url}
                alt={images?.attributes?.alt || ""}
                quality={100}
                priority
                fetchPriority="high"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-3600"
              />
              <div className="absolute inset-0 bg-linear-to-t from-[#A86F79] to-transparent mix-blend-multiply"></div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
