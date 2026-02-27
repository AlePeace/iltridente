import { Buttons } from "components/Buttons";
import { Heading } from "components/Heading";

export const BookExpHome = ({ blocks }) => {
  const innerBlocks = blocks?.innerBlocks || [];
  const headings = innerBlocks.filter((block) => block.name === "core/heading");
  const buttons = innerBlocks.find((block) => block.name === "core/buttons");

  const title = headings[1];
  const subtitle = headings[0];

  return (
    <section className="relative z-10 px-5 h-[70vh] bg-lightblue/20 flex flex-col justify-center text-center gap-10">
      {subtitle && (
        <Heading
          level={subtitle.attributes?.level}
          content={subtitle.attributes?.content}
          className="font-nunito font-normal tracking-widest uppercase text-xs text-gray text-center"
        />
      )}
      {title && (
        <Heading
          level={title.attributes?.level}
          content={title.attributes?.content}
          className="font-montecatini font-normal text-5xl lg:text-6xl xl:text-7xl text-blue text-center"
        />
      )}
      {buttons && (
        <Buttons blocks={buttons.innerBlocks} className="justify-center" variant="BookExp" />
      )}
    </section>
  );
};
