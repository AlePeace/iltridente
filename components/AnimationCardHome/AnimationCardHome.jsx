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
  { bg: "#FF9E4E", text: "#FFFFFF" },
  { bg: "#A0B898", text: "#FFFFFF" },
  { bg: "#00ABD5", text: "#FFFFFF" },
];

const parseCardFromGroup = (group, index) => {
  const { innerBlocks = [] } = group;

  const image = innerBlocks.find((b) => b.name === "core/image");
  const headings = innerBlocks.filter((b) => b.name === "core/heading");
  const paragraph = innerBlocks.find((b) => b.name === "core/paragraph");

  const colors = fallbackPalette[index % fallbackPalette.length];
  const bg = group?.attributes?.style?.color?.background || colors.bg;
  const text = group?.attributes?.style?.color?.text || colors.text;

  return {
    id: group?.clientId || `card-${index}`,
    image,
    title: headings[0],
    subtitle: headings[1],
    paragraph,
    link: headings[2],
    bg,
    text,
  };
};

export const AnimationCardHome = ({ blocks }) => {
  const { innerBlocks = [] } = blocks;

  const sectionTitle = innerBlocks[0];
  const sectionSubtitle = innerBlocks[1];
  const cardGroups = innerBlocks.filter(
    (b, i) => b.name === "core/group" && i > 1,
  );
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
      {/* Titolo sezione (fuori animazione) */}
      <div className="space-y-3 py-12 text-center">
        {sectionTitle && (
          <Heading
            level={sectionTitle.attributes?.level}
            content={sectionTitle.attributes?.content}
            className="font-montecatini font-normal text-5xl lg:text-7xl xl:text-8xl text-blue"
          />
        )}
        {sectionSubtitle && (
          <Heading
            level={sectionSubtitle.attributes?.level}
            content={sectionSubtitle.attributes?.content}
            className="font-montecatini font-normal text-2xl lg:text-4xl xl:text-5xl text-blue"
          />
        )}
      </div>

      {/* Desktop animated section */}
      <section
        ref={sectionRef}
        id="cardScroller"
        className="relative hidden lg:block h-screen overflow-hidden"
      >
        {cards.map((card, i) => {
          const img = imgAttr(card.image);
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
                  <div data-card-right-reveal className="h-full w-full">
                    {card.image && (
                      <Image
                        src={img.url}
                        alt={img.alt || "Card image"}
                        width={img.width || 1600}
                        height={img.height || 900}
                        className="w-full h-full object-cover"
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
                {card.paragraph && (
                  <Paragraph
                    content={card.paragraph.attributes?.content}
                    className="font-nunito font-light text-base"
                  />
                )}
                {card.subtitle && (
                  <Heading
                    level={card.subtitle.attributes?.level}
                    content={card.subtitle.attributes?.content}
                    className="font-montecatini font-normal text-3xl"
                  />
                )}
              </div>

              {card.image && (
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
