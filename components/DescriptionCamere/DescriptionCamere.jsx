import { Paragraph } from "components/Paragraph";

export const DescriptionCamere = ({ blocks }) => {
  const innerBlocks = blocks?.innerBlocks || [];
  const paragraphBlock = innerBlocks.find((b) => b.name === "core/paragraph");


  return (
    <section className="py-10 lg:py-40 relative z-30">
        <div className="px-5 max-w-7xl mx-auto">
          <div className="pl-7 border-l border-gray/30">
            <Paragraph
              content={paragraphBlock?.attributes?.content}
              className="font-nunito font-light text-gray text-base lg:text-lg xl:text-xl"
            />
          </div>
        </div>
    </section>
  );
};
