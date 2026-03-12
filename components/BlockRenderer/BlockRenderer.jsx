import { AccordionMenu } from "components/AccordionMenu";
import { BarHome } from "components/BarHome/BarHome";
import { CardsCenaHome } from "components/CardsCenaHome";
import { CardsPage } from "components/CardsPage/CardsPage";
import { CardsPranzoHome } from "components/CardsPranzoHome";
import { DescriptionBar } from "components/DescriptionBar";
import { DescriptionHome } from "components/DescriptionHome";
import { DescriptionRisto } from "components/DescriptionRisto";
import { EventFormPage } from "components/EventFormPage/EventFormPage";
import { Footer } from "components/Footer";
import { GalleryHome } from "components/GalleryHome/GalleryHome";
import { HeroBar } from "components/HeroBar";
import { HeroHome } from "components/HeroHome";
import { HeroRisto } from "components/HeroRisto/HeroRisto";
import { IntroBreakfastRisto } from "components/IntroBreakfastRisto/IntroBreakfastRisto";
import { IntroCenaRisto } from "components/IntroCenaRisto/IntroCenaRisto";
import { IntroDrinkBar } from "components/IntroDrinkBar/IntroDrinkBar";
import { IntroEasyBar } from "components/IntroEasyBar/IntroEasyBar";
import { IntroPranzoRisto } from "components/IntroPranzoRisto";
import { PrenotazioniHome } from "components/PrenotazioniHome";
import { ReservationPage } from "components/ReservationPage";

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

          case "HeroRisto":
            return <HeroRisto key={block.id} blocks={block} />;

          case "DescriptionRisto":
            return <DescriptionRisto key={block.id} blocks={block} />;

          case "IntroPranzoRisto":
            return <IntroPranzoRisto key={block.id} blocks={block} />;

          case "IntroCenaRisto":
            return <IntroCenaRisto key={block.id} blocks={block} />;

          case "IntroBreakfastRisto":
            return <IntroBreakfastRisto key={block.id} blocks={block} />;

          case "HeroBar":
            return <HeroBar key={block.id} blocks={block} />;

          case "DescriptionBar":
            return <DescriptionBar key={block.id} blocks={block} />;

          case "IntroDrinkBar":
            return <IntroDrinkBar key={block.id} blocks={block} />;

          case "IntroEasyBar":
            return <IntroEasyBar key={block.id} blocks={block} />;

          case "AccordionMenu":
            return <AccordionMenu key={block.id} blocks={block} />;

          case "ReservationPage":
            return <ReservationPage key={block.id} blocks={block} />;

          case "EventFormPage":
            return <EventFormPage key={block.id} blocks={block} />;

          case "CardsPage":
            return <CardsPage key={block.id} blocks={block} />;

          case "Footer":
            return <Footer key={block.id} blocks={block} />;

          default:
            return null;
        }
      }
    }
  });
};
