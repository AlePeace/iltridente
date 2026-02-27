"use client";

import { useRef } from "react";
import { Cover } from "components/Cover";
import { Heading } from "components/Heading";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";

gsap.registerPlugin(useGSAP, MorphSVGPlugin);

export const HeroCamere = ({ blocks }) => {
  const container = useRef(null);
  const initialD = useRef("");

  const coverBlock = blocks?.innerBlocks?.[0];
  const headingBlock = coverBlock?.innerBlocks?.[0];
  const background = {
    backgroundImage: coverBlock?.attributes?.url
      ? { url: coverBlock.attributes.url }
      : null,
    backgroundColor: coverBlock?.attributes?.customOverlayColor || null,
  };
  useGSAP(
    () => {
      const from = container.current?.querySelector("#morphFrom");
      const to = container.current?.querySelector("#morphTo");
      if (!from || !to) return;

      if (!initialD.current) initialD.current = from.getAttribute("d") || "";

      // reset iniziale, così riparte sempre quando rientri nella pagina
      gsap.set(from, { attr: { d: initialD.current } });

      gsap.to(from, {
        duration: 6,
        ease: "power2.inOut",
        morphSVG: "#morphTo",
      });
    },
    { scope: container },
  );

  return (
    <section ref={container} className="w-full h-screen relative">
      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "linear-gradient(179.96deg, rgba(0, 0, 0, 0) 0.04%, rgba(0, 0, 0, 0.26) 70.31%)",
          mixBlendMode: "darken",
        }}
      ></div>
      <Cover background={background}>
        <div className="flex flex-col gap-5 lg:gap-10">
          {headingBlock && (
            <Heading
              level={headingBlock.attributes?.level}
              content={headingBlock.attributes?.content}
              className="font-montecatini px-10 text-center text-white font-normal text-5xl lg:text-7xl"
            ></Heading>
          )}
        </div>
      </Cover>
      <div className="absolute w-full left-0 bottom-0 z-20">
        <svg
          id="Livello_1"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 0 1280 321"
          className="translate-y-1/2"
        >
          <path
            id="morphFrom"
            className="fill-white"
            d="M639.3,319.9c0-103.9-56.7-160.1-161.3-160.1,104.6,0,161.3-56.3,161.3-160.1,0,103.9,56.7,160.1,161.3,160.1-104.6,0-161.3,56.3-161.3,160.1Z"
          />
          <path
            id="morphTo"
            className="fill-white"
            style={{ visibility: "hidden" }}
            d="M639.3,319.9c0-103.9-532.2-160.1-636.8-160.1,104.6,0,636.8.3,636.8.3,0,0,532.2-.3,636.8-.3-104.6,0-636.8,56.3-636.8,160.1Z"
          />
        </svg>
      </div>
    </section>
  );
};
