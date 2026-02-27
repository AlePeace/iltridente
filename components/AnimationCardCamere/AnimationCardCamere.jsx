"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Heading } from "components/Heading";
import { Paragraph } from "components/Paragraph";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const fallbackPalette = [
  { bg: "#C53452", text: "#FFFFFF" },
  { bg: "#57A691", text: "#FFFFFF" },
  { bg: "#EFAC53", text: "#FFFFFF" },
  { bg: "#1F5189", text: "#FFFFFF" },
  { bg: "#A0B898", text: "#FFFFFF" },
  { bg: "#FFAB67", text: "#FFFFFF" },
  { bg: "#00ABD5", text: "#FFFFFF" },
];

const fallbackPaletteRight = [
  { bg: "#FFB87D21", text: "#6C6C6C" },
  { bg: "#49907D1A", text: "#6C6C6C" },
  { bg: "#FFB87D21", text: "#6C6C6C" },
  { bg: "#1F51891A", text: "#6C6C6C" },
  { bg: "#A0B8984D", text: "#6C6C6C" },
  { bg: "#FFAB674D", text: "#6C6C6C" },
  { bg: "#00ABD51A", text: "#6C6C6C" },
];

const parseCardFromGroup = (group, index) => {
  const { innerBlocks = [] } = group;

  const images = innerBlocks.filter((b) => b.name === "core/image");
  const imgvert = images[0] || null;
  const imgoriz = images[1] || null;
  const headings = innerBlocks.filter((b) => b.name === "core/heading");
  const paragraph = innerBlocks.find((b) => b.name === "core/paragraph");

  const leftColors = fallbackPalette[index % fallbackPalette.length];
  const rightColors = fallbackPaletteRight[index % fallbackPaletteRight.length];

  const leftBg = group?.attributes?.style?.color?.background || leftColors.bg;
  const leftText = group?.attributes?.style?.color?.text || leftColors.text;

  const rightBg =
    group?.attributes?.rightStyle?.color?.background || rightColors.bg;
  const rightText =
    group?.attributes?.rightStyle?.color?.text || rightColors.text;

  return {
    id: group?.clientId || `card-${index}`,
    imgvert,
    imgoriz,
    title: headings[0],
    subtitle: headings[1],
    paragraph,
    link: headings[2],
    bg: leftBg,
    text: leftText,
    rightBg,
    rightText,
  };
};

export const AnimationCardCamere = ({ blocks }) => {
  const { innerBlocks = [] } = blocks;
  const cardGroups = innerBlocks.filter((b) => b.name === "core/group");
  const cards = cardGroups.map(parseCardFromGroup);

  const sectionRef = useRef(null);
  const panelsRef = useRef([]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const panels = panelsRef.current.filter(Boolean);
        if (!panels.length) return;

        const lefts = panels
          .map((p) => p.querySelector("[data-card-left]"))
          .filter(Boolean);

        const rightReveals = panels
          .map((p) => p.querySelector("[data-card-right-reveal]"))
          .filter(Boolean);

        if (
          lefts.length !== panels.length ||
          rightReveals.length !== panels.length
        ) {
          return;
        }

        panels.forEach((panel, i) => {
          gsap.set(panel, {
            position: "absolute",
            inset: 0,
            zIndex: panels.length - i,
            force3D: true,
          });
        });

        gsap.set(lefts, {
          xPercent: -70,
          yPercent: 100,
          rotation: -25,
          transformOrigin: "0% 100%",
          willChange: "transform",
          force3D: true,
        });

        lefts.forEach((el, idx) => {
          const isFirst = idx === 0;
          // primo left parte già a metà animazione
          gsap.set(el, {
            xPercent: isFirst ? -35 : -70,
            yPercent: isFirst ? 50 : 100,
            rotation: isFirst ? -12.5 : -25,
            transformOrigin: "0% 100%",
            willChange: "transform",
            force3D: true,
          });
        });

        rightReveals.forEach((el, i) => {
          const clip = i === 0 ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)";
          gsap.set(el, {
            clipPath: clip,
            WebkitClipPath: clip,
            willChange: "clip-path",
          });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: `+=${panels.length * 180}%`,
            pin: true,
            scrub: true,
            snap: false,
            invalidateOnRefresh: true,
          },
        });

        // Prima left entra come da richiesta
        tl.to(lefts[0], {
          xPercent: 0,
          yPercent: 0,
          rotation: 0,
          ease: "none",
          duration: 1,
        });

        // Ogni nuova card sale sopra e si anima (senza nascondere con opacity)
        for (let i = 0; i < panels.length - 1; i++) {
          const next = i + 1;

          tl.set(panels[next], { zIndex: panels.length + next }, "+=0")
            .to(
              rightReveals[next],
              {
                clipPath: "inset(0% 0% 0% 0%)",
                WebkitClipPath: "inset(0% 0% 0% 0%)",
                ease: "none",
                duration: 1,
              },
              "<",
            )
            .to(
              lefts[next],
              {
                xPercent: 0,
                yPercent: 0,
                rotation: 0,
                ease: "none",
                duration: 1,
              },
              "<",
            );
        }
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  if (!cards.length) return null;

  const imgAttr = (img) => img?.attributes || {};

  return (
    <>
      {/* Desktop animated section */}
      <section
        ref={sectionRef}
        id="cardScrollerCamere"
        className="relative hidden lg:block h-screen overflow-hidden"
      >
        {cards.map((card, i) => {
          const img = imgAttr(card.imgvert);
          const imgoriz = imgAttr(card.imgoriz);
          return (
            <div
              key={card.id}
              ref={(el) => {
                panelsRef.current[i] = el;
              }}
              className="card-panel"
            >
              <div className="h-full flex">
                <div
                  data-card-left
                  className="basis-1/2 h-full flex items-center justify-center"
                  style={{ backgroundColor: card.bg, color: card.text }}
                >
                  <div className="px-12 xl:px-20 py-12 space-y-6 text-center">
                    {card.title && (
                      <Heading
                        level={card.title.attributes?.level}
                        content={card.title.attributes?.content}
                        className="font-montecatini font-normal text-6xl xl:text-7xl"
                      />
                    )}

                    {card.subtitle && (
                      <Heading
                        level={card.subtitle.attributes?.level}
                        content={card.subtitle.attributes?.content}
                        className="font-montecatini font-normal uppercase text-base xl:text-lg"
                      />
                    )}

                    {card.paragraph && (
                      <Paragraph
                        content={card.paragraph.attributes?.content}
                        className="font-nunito font-light text-base xl:text-lg"
                      />
                    )}

                    {card.link && (
                      <Heading
                        level={card.link.attributes?.level}
                        content={card.link.attributes?.content}
                        className="font-montecatini uppercase text-lg xl:text-xl"
                      />
                    )}
                  </div>
                </div>

                <div
                  data-card-right
                  className="basis-1/2 h-full overflow-hidden"
                >
                  <div
                    data-card-right-reveal
                    style={{
                      backgroundColor: card.rightBg,
                      color: card.rightText,
                    }}
                    className="h-full w-full"
                  >
                    {img && img.url && (
                      <Image
                        src={img.url}
                        alt={img.alt || "Card image"}
                        width={img.width || 1600}
                        height={img.height || 900}
                        className="w-1/2 h-1/2 object-cover"
                        priority={i === 0}
                      />
                    )}
                    {img && img.url && (
                      <Image
                        src={img.url}
                        alt={img.alt || "Card image"}
                        width={img.width || 1600}
                        height={img.height || 900}
                        className="w-1/2 h-1/2 object-cover"
                        priority={i === 0}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Mobile fallback (stack) */}
      <section className="lg:hidden py-8">
        {cards.map((card) => {
          const img = imgAttr(card.image);
          return (
            <div key={`m-${card.id}`} className="flex flex-col overflow-hidden">
              <div
                className="px-8 py-12 space-y-4 text-center"
                style={{ backgroundColor: card.bg, color: card.text }}
              >
                {card.title && (
                  <Heading
                    level={card.title.attributes?.level}
                    content={card.title.attributes?.content}
                    className="font-montecatini font-normal text-5xl"
                  />
                )}
                {card.subtitle && (
                  <Heading
                    level={card.subtitle.attributes?.level}
                    content={card.subtitle.attributes?.content}
                    className="font-montecatini font-normal text-3xl"
                  />
                )}
                {card.paragraph && (
                  <Paragraph
                    content={card.paragraph.attributes?.content}
                    className="font-nunito font-light text-base"
                  />
                )}
              </div>

              {img && img.url && (
                <Image
                  src={img.url}
                  alt={img.alt || "Card image"}
                  width={img.width || 1600}
                  height={img.height || 900}
                  className="w-full h-auto object-cover"
                />
              )}
            </div>
          );
        })}
      </section>
    </>
  );
};
