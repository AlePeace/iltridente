import { BarHome } from "components/BarHome/BarHome";
import { CardsCenaHome } from "components/CardsCenaHome";
import { CardsPranzoHome } from "components/CardsPranzoHome";
import { DescriptionHome } from "components/DescriptionHome";
import { GalleryHome } from "components/GalleryHome/GalleryHome";
import { HeroHome } from "components/HeroHome";
import { PrenotazioniHome } from "components/PrenotazioniHome";

export const BlockRenderer = ({ blocks }) => {
  return blocks.map((block) => {
    switch (block.name) {
      case "core/group": {
        const groupName =
          block.attributes?.metadata?.name || block.attributes?.className;
        console.log("GROUP BLOCK: ", block);
        console.log("GROUP NAME: ", groupName);
        switch (groupName) {
          case "HeroHome":
            return <HeroHome key={block.id} blocks={block} />;

          case "DescriptionHome":
            return <DescriptionHome key={block.id} blocks={block} />;

          case "CardsPranzoHome":
            return <CardsPranzoHome key={block.id} blocks={block} />;

          case "CardsCenaHome":
            return <CardsCenaHome key={block.id} blocks={block} />;

          case "BarHome":
            return <BarHome key={block.id} blocks={block} />;

          case "PrenotazioniHome":
            return <PrenotazioniHome key={block.id} blocks={block} />;

          case "GalleryHome":
            return <GalleryHome key={block.id} blocks={block} />;

          default:
            return null;
        }
      }
    }
  });
};
