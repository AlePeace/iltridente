"use client";
import { useState } from "react";
import { Heading } from "../Heading";
import { Paragraph } from "../Paragraph";

// Configurazione colori per tipo di menu
const themeConfig = {
  "accordion-lunch": {
    classSelector: "accordion-lunch",
    bg: "bg-cardspranzo/90",
    headerBg: "hover:bg-cardspranzo",
    contentBg: "bg-white",
    border: "border-cardspranzo",
    titleColor: "text-red",
    descColor: "text-text",
    descDish: "text-text",
    sectionTitle: "text-red",
    titleDish: "text-text",
    dishBg: "bg-white",
    dishBorder: "border-cardspranzo",
    priceBg: "bg-white",
    priceText: "text-text",
    footerTextInfo: "text-green",
    footerTextDescription: "text-text",
    footerBg: "bg-cardspranzo",
    icon: "text-ocean",
  },
  "accordion-dinner": {
    classSelector: "accordion-dinner",
    bg: "bg-ocean/90",
    headerBg: "hover:bg-ocean",
    contentBg: "bg-white",
    border: "border-ocean",
    titleColor: "text-pink",
    descColor: "text-white",
    descDish: "text-text",
    sectionTitle: "text-ocean",
    dishBg: "bg-white",
    dishBorder: "border-cardspranzo",
    priceBg: "bg-white",
    priceText: "text-text",
    footerTextInfo: "text-green",
    footerTextDescription: "text-text",
    footerBg: "bg-cardspranzo",
    icon: "text-white",
  },
  "accordion-bar": {
    classSelector: "accordion-bar",
    bg: "bg-cardspranzo",
    headerBg: "hover:bg-cardspranzo",
    contentBg: "bg-white",
    border: "border-cardspranzo",
    titleColor: "text-ocean",
    descColor: "text-text",
    descDish: "text-text",
    sectionTitle: "text-red",
    dishBg: "bg-white",
    dishBorder: "border-cardspranzo",
    priceBg: "bg-white",
    priceText: "text-text",
    footerTextInfo: "text-green",
    footerTextDescription: "text-text",
    footerBg: "bg-cardspranzo",
    icon: "text-ocean",
  },
};

const defaultTheme = {
  classSelector: "accordion-chef",
  bg: "bg-cardspranzo",
  headerBg: "hover:bg-cardspranzo",
  contentBg: "bg-cardspranzo",
  border: "border-cardspranzo",
  titleColor: "text-ocean",
  descColor: "text-text",
  descDish: "text-text",
  sectionTitle: "text-ocean",
  dishBg: "",
  dishBorder: "border-borderbutton",
  priceBg: "bg-cardspranzo",
  priceText: "text-ocean",
  footerTextInfo: "text-green",
  footerTextDescription: "text-text",
  footerBg: "bg-cardspranzo",
  icon: "text-ocean",
};

function getTheme(className) {
  if (className?.includes("accordion-lunch"))
    return themeConfig["accordion-lunch"];
  if (className?.includes("accordion-dinner"))
    return themeConfig["accordion-dinner"];
  if (className?.includes("accordion-bar")) return themeConfig["accordion-bar"];
  return defaultTheme;
}

export const AccordionMenu = ({ blocks }) => {
  const innerBlocks = blocks?.innerBlocks || [];
  const [isOpen, setIsOpen] = useState(false);

  // Rileva il tema dal className del gruppo
  const groupClassName = blocks?.attributes?.className || "";
  const theme = getTheme(groupClassName);

  // Titolo e descrizione dell'accordion (il bottone)
  const mainTitle = innerBlocks.find((b) =>
    b.attributes?.className?.includes("accordion-title"),
  );
  const mainDescription = innerBlocks.find((b) =>
    b.attributes?.className?.includes("accordion-description"),
  );

  // Footer info e description
  const footerInfo = innerBlocks.find((b) =>
    b.attributes?.className?.includes("accordion-footer-info"),
  );
  const footerDescription = innerBlocks.find((b) =>
    b.attributes?.className?.includes("accordion-footer-description"),
  );

  // Costruisci le sezioni del menu
  const sections = [];
  let currentSection = null;
  let currentDish = null;

  innerBlocks.forEach((block) => {
    const className = block.attributes?.className || "";

    // Salta blocchi già estratti
    if (
      className.includes("accordion-title") ||
      className.includes("accordion-description") ||
      className.includes("accordion-footer-info") ||
      className.includes("accordion-footer-description")
    ) {
      return;
    }

    if (className.includes("section-title")) {
      if (currentDish && currentSection) {
        currentSection.dishes.push(currentDish);
      }
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        block,
        dishes: [],
      };
      currentDish = null;
    } else if (className.includes("dish-name")) {
      if (currentDish && currentSection) {
        currentSection.dishes.push(currentDish);
      }
      currentDish = {
        nameBlock: block,
        ingredientsBlock: null,
        priceBlock: null,
      };
    } else if (className.includes("dish-details") && currentDish) {
      currentDish.ingredientsBlock = block;
    } else if (className.includes("dish-price") && currentDish) {
      currentDish.priceBlock = block;
    }
  });

  if (currentDish && currentSection) {
    currentSection.dishes.push(currentDish);
  }
  if (currentSection) {
    sections.push(currentSection);
  }

  return (
    <div className={`${theme.classSelector} max-w-6xl mx-auto px-4 py-12`}>
      <div
        className={`${theme.border} ${theme.bg} border-2 rounded-lg overflow-hidden`}
      >
        {/* Bottone Accordion */}
        <button
          className={`w-full flex flex-col items-start px-6 py-5 bg-transparent border-none cursor-pointer text-left ${theme.headerBg} transition-colors`}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <div className="w-full flex justify-between items-center">
            <div>
              {mainTitle && (
                <Heading
                  content={mainTitle.attributes?.content}
                  level={mainTitle.attributes?.level}
                  className={`text-2xl font-normal ${theme.titleColor} font-cinzel m-0`}
                />
              )}
              {mainDescription && (
                <Paragraph
                  content={mainDescription.attributes?.content}
                  textColor={mainDescription.attributes?.textColor}
                  className={`text-base font-nunito font-light ${theme.descColor} m-0 mt-2`}
                />
              )}
            </div>
            <span
              className={`text-2xl font-light ${theme.icon} transition-transform duration-300`}
            >
              {isOpen ? "−" : "+"}
            </span>
          </div>
        </button>

        {/* Contenuto Accordion */}
        <div
          className={`overflow-hidden rounded-lg ${theme.contentBg} transition-all duration-400 ease-in-out ${
            isOpen ? "max-h-[5000px]" : "max-h-0"
          }`}
        >
          <div className="pt-5 lg:pt-10 px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-8">
              {sections.map((section, sIndex) => (
                <div key={sIndex} className="mb-8 last:mb-0">
                  {/* Titolo sezione */}
                  <Heading
                    content={section.block.attributes?.content}
                    level={section.block.attributes?.level}
                    className={`font-nunito uppercase font-normal text-xl ${theme.sectionTitle} mb-4 pb-2`}
                  />

                  {/* Piatti della sezione */}
                  {section.dishes.map((dish, dIndex) => (
                    <div
                      key={dIndex}
                      className={`flex justify-between items-start p-4 border-b-3 ${theme.dishBorder} ${theme.dishBg} mb-2`}
                    >
                      <div className="flex-1 mr-4">
                        <Heading
                          content={dish.nameBlock.attributes?.content}
                          level={dish.nameBlock.attributes?.level}
                          className={`font-nunito text-lg font-medium flex items-center gap-2 ${theme.titleDish} m-0 mb-1`}
                        />
                        {dish.ingredientsBlock && (
                          <Paragraph
                            content={dish.ingredientsBlock.attributes?.content}
                            textColor={
                              dish.ingredientsBlock.attributes?.textColor
                            }
                            className={`font-nunito font-light text-text text-base ${theme.descDish} m-0 flex flex-wrap items-center gap-2`}
                          />
                        )}
                      </div>

                      {dish.priceBlock && (
                        <div
                          className={`${theme.priceBg} px-3 rounded text-base font-semibold ${theme.priceText} whitespace-nowrap`}
                        >
                          <Paragraph
                            content={dish.priceBlock.attributes?.content}
                            textColor={dish.priceBlock.attributes?.textColor}
                            className="m-0 font-nunito font-light"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          {(footerInfo || footerDescription) && (
            <div
              className={`py-5 border-t flex flex-col justify-center items-center ${theme.footerBg}  ${theme.dishBorder}`}
            >
              {footerInfo && (
                <Paragraph
                  content={footerInfo.attributes?.content}
                  textColor={footerInfo.attributes?.textColor}
                  className={`flex items-center gap-2 text-sm text-center ${theme.footerTextInfo} m-0 mb-2 font-medium`}
                />
              )}
              {footerDescription && (
                <Paragraph
                  content={footerDescription.attributes?.content}
                  textColor={footerDescription.attributes?.textColor}
                  className={`hidden items-center gap-2 text-base font-nunito font-light text-center flex-wrap ${theme.footerTextDescription} m-0`}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
