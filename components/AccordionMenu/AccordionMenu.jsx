"use client";
import { useState } from "react";
import { Heading } from "../Heading";
import { Paragraph } from "../Paragraph";

export const AccordionMenu = ({ blocks }) => {
  const innerBlocks = blocks?.innerBlocks || [];
  const [isOpen, setIsOpen] = useState(false);

  // Titolo e descrizione dell'accordion (il bottone)
  const mainTitle = innerBlocks.find((b) =>
    b.attributes?.className?.includes("accordion-title"),
  );
  const mainDescription = innerBlocks.find((b) =>
    b.attributes?.className?.includes("accordion-description"),
  );

  // Costruisci le sezioni del menu
  const sections = [];
  let currentSection = null;
  let currentDish = null;

  innerBlocks.forEach((block) => {
    const className = block.attributes?.className || "";

    if (className.includes("section-title")) {
      // Salva piatto e sezione precedenti
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

  // Salva l'ultimo piatto e sezione
  if (currentDish && currentSection) {
    currentSection.dishes.push(currentDish);
  }
  if (currentSection) {
    sections.push(currentSection);
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="border border-stone-200 rounded-lg overflow-hidden bg-white">
        {/* Bottone Accordion */}
        <button
          className="w-full flex flex-col items-start px-6 py-5 bg-transparent border-none cursor-pointer text-left hover:bg-stone-50 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <div className="w-full flex justify-between items-center">
            {mainTitle && (
              <Heading
                content={mainTitle.attributes?.content}
                level={mainTitle.attributes?.level}
                className="text-2xl font-bold text-stone-800 m-0"
              />
            )}
            <span className="text-2xl font-light text-stone-400 transition-transform duration-300">
              {isOpen ? "−" : "+"}
            </span>
          </div>
          {mainDescription && (
            <Paragraph
              content={mainDescription.attributes?.content}
              textColor={mainDescription.attributes?.textColor}
              className="text-base text-stone-500 m-0 mt-2"
            />
          )}
        </button>

        {/* Contenuto Accordion */}
        <div
          className={`overflow-hidden transition-all duration-400 ease-in-out ${
            isOpen ? "max-h-[5000px]" : "max-h-0"
          }`}
        >
          <div className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-8">
              {sections.map((section, sIndex) => (
                <div key={sIndex} className="mb-8 last:mb-0 ">
                  {/* Titolo sezione */}
                  <Heading
                    content={section.block.attributes?.content}
                    level={section.block.attributes?.level}
                    className="text-xl font-semibold text-stone-800 mb-4 pb-2"
                  />

                  {/* Piatti della sezione */}

                  {section.dishes.map((dish, dIndex) => (
                    <div
                      key={dIndex}
                      className="flex justify-between items-start p-4 border-b border-borderbutton mb-2"
                    >
                      {/* Info piatto */}
                      <div className="flex-1 mr-4">
                        <Heading
                          content={dish.nameBlock.attributes?.content}
                          level={dish.nameBlock.attributes?.level}
                          className="text-base font-semibold text-stone-800 m-0 mb-1"
                        />
                        {dish.ingredientsBlock && (
                          <Paragraph
                            content={dish.ingredientsBlock.attributes?.content}
                            textColor={
                              dish.ingredientsBlock.attributes?.textColor
                            }
                            className="text-sm text-stone-400 m-0 italic leading-relaxed"
                          />
                        )}
                      </div>

                      {/* Prezzo */}
                      {dish.priceBlock && (
                        <div className="bg-stone-200 px-3 py-1.5 rounded text-base font-semibold text-text whitespace-nowrap self-center">
                          <Paragraph
                            content={dish.priceBlock.attributes?.content}
                            textColor={dish.priceBlock.attributes?.textColor}
                            className="m-0"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
