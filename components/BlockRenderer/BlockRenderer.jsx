import { AnimationCardCamere } from "components/AnimationCardCamere";
import { AnimationCardHome } from "components/AnimationCardHome";
import { BookExpHome } from "components/BookExpHome/BookExpHome";
import { CameraHome } from "components/CameraHome/CameraHome";
import { CilentoHome } from "components/CilentoHome";
import { DescriptionCamere } from "components/DescriptionCamere/DescriptionCamere";
import { HeroCamere } from "components/HeroCamere/HeroCamere";
import { HeroHome } from "components/HeroHome/HeroHome";
import { SuggestHome } from "components/SuggestHome";
import { VillaHome } from "components/VillaHome";

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

          case "VillaHome":
            return <VillaHome key={block.id} blocks={block} />;

          case "CameraHome":
            return <CameraHome key={block.id} blocks={block} />;

          case "AnimationCardHome":
            return <AnimationCardHome key={block.id} blocks={block} />;

          case "CilentoHome":
            return <CilentoHome key={block.id} blocks={block} />;

          case "BookExpHome":
            return <BookExpHome key={block.id} blocks={block} />;

          case "SuggestHome":
            return <SuggestHome key={block.id} blocks={block} />;

          case "HeroCamere":
            return <HeroCamere key={block.id} blocks={block} />;

          case "DescriptionCamere":
            return <DescriptionCamere key={block.id} blocks={block} />;

          case "AnimationCardCamere":
            return <AnimationCardCamere key={block.id} blocks={block} />;

          default:
            return null;
        }
      }
    }
  });
};
