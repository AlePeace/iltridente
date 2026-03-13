import { Heading } from "components/Heading";
import { Paragraph } from "components/Paragraph";

export const ParagraphGroup = ({ blocks }) => {
  const innerBlocks = blocks?.innerBlocks || [];
  const heading = innerBlocks.find((block) => block.name === "core/heading");
  const paragraphs = innerBlocks.filter(
    (block) => block.name === "core/paragraph",
  );

  return (
    <section className="px-5 lg:px-20 py-20 lg:py-40">
      <div className="max-w-5xl mx-auto space-y-10">
        {heading && (
          <Heading
            className="font-cinzel text-3xl lg:text-5xl text-text uppercase tracking-wider"
            content={heading.attributes?.content}
            level={heading.attributes?.level}
          />
        )}
        {paragraphs.map((block) => (
          <Paragraph
            key={block.id}
            content={block.attributes?.content}
            className="font-nunito font-normal text-text text-base"
          />
        ))}
      </div>
    </section>
  );
};
