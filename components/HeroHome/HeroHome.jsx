"use client";

import { useState, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import Image from "next/image";
import { Heading } from "components/Heading";

gsap.registerPlugin(useGSAP, MorphSVGPlugin);

const isDaytime = () => {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 20;
};

export const HeroHome = ({ blocks }) => {
  const innerBlocks = blocks?.innerBlocks || [];
  const heading = innerBlocks.find((block) => block.name === "core/heading");
  const image = innerBlocks.filter((block) => block.name === "core/image");

  const imgNight = image[0];
  const imgDay = image[1];
  const logo = image[2];

  const [isDay, setIsDay] = useState(isDaytime());
  const isAnimating = useRef(false);

  const containerRef = useRef(null);
  const imgDayRef = useRef(null);
  const imgNightRef = useRef(null);

  const scrollIndicatorRef = useRef(null);
  // imposta visibilità iniziale in base all'ora
  useGSAP(
    () => {
      gsap.set(imgDayRef.current, { opacity: isDay ? 1 : 0 });
      gsap.set(imgNightRef.current, { opacity: isDay ? 0 : 1 });

      gsap.fromTo(
        scrollIndicatorRef.current,
        { y: 0, opacity: 1 },
        {
          y: 10,
          opacity: 0.7,
          duration: 1.2,
          ease: "power1.inOut",
          repeat: -1, // loop infinito
          yoyo: true, // non torna indietro, riparte dall'inizio
        },
      );
    },
    { scope: containerRef },
  );

  const handleToggle = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const showRef = isDay ? imgNightRef.current : imgDayRef.current;
    const hideRef = isDay ? imgDayRef.current : imgNightRef.current;

    const tl = gsap.timeline({
      onComplete: () => {
        setIsDay((prev) => !prev);
        isAnimating.current = false;
      },
    });

    // blending: le due immagini si incrociano contemporaneamente
    tl.to(
      hideRef,
      {
        opacity: 0,
        duration: 1.5,
        ease: "power1.inOut",
      },
      0,
    );

    tl.to(
      showRef,
      {
        opacity: 1,
        duration: 1.5,
        ease: "power1.inOut",
      },
      0,
    );

    // morph SVG bottone
    tl.to(
      "#sun",
      {
        duration: 0.8,
        morphSVG: isDay ? "#moon" : "#sun",
        ease: "power2.inOut",
      },
      0,
    );
  };

  return (
    <section
      ref={containerRef}
      className="h-screen w-full bg-[#411C19] relative overflow-hidden"
    >
      <div className="relative w-full h-full">
        {imgDay && (
          <Image
            ref={imgDayRef}
            width={imgDay.attributes?.width || 1920}
            height={imgDay.attributes?.height || 1080}
            src={imgDay.attributes?.url}
            alt={imgDay.attributes?.alt || ""}
            quality={100}
            priority
            fetchPriority="high"
            className="absolute inset-0 z-10 w-full h-screen object-cover"
          />
        )}
        {imgNight && (
          <Image
            ref={imgNightRef}
            width={imgNight.attributes?.width || 1920}
            height={imgNight.attributes?.height || 1080}
            src={imgNight.attributes?.url}
            alt={imgNight.attributes?.alt || ""}
            quality={100}
            priority
            fetchPriority="high"
            className="absolute inset-0 z-10 w-full h-screen object-cover"
          />
        )}
      </div>
      {logo && (
        <div className="absolute top-1/2 left-1/2 z-20 lg:w-1/4 -translate-1/2">
          <Image
            width={logo.attributes?.width || 500}
            height={logo.attributes?.height || 500}
            src={logo.attributes?.url}
            alt={logo.attributes?.alt || ""}
            quality={100}
            className="object-contain will-change-transform pointer-events-none"
          />
        </div>
      )}
      {heading && (
        <div className="absolute bottom-5 w-full z-20">
          <Heading
            level={heading.attributes?.level}
            content={heading.attributes?.content}
            className="uppercase font-nunito text-xs font-light text-white text-center"
          />
        </div>
      )}
      <div className="absolute bottom-26 left-1/2 -translate-x-1/2 z-20 w-5 h-5">
        <svg
          id="Livello_1"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 0 31.2 49.4"
        >
          <path
            className="fill-white/60"
            d="M15.6.6C7.1.6.2,7.5.2,16v17.6c0,8.5,6.9,15.4,15.4,15.4s15.4-6.9,15.4-15.4V16C31,7.5,24.1.6,15.6.6ZM15.6,44.6c-6.1,0-11-4.9-11-11V16c0-6.1,4.9-11,11-11s11,4.9,11,11v17.6c0,6.1-4.9,11-11,11Z"
          />
          <path
            ref={scrollIndicatorRef}
            className="fill-white/60"
            d="M13.4,16c0-1.2,1-2.2,2.2-2.2s2.2,1,2.2,2.2v8.8c0,1.2-1,2.2-2.2,2.2s-2.2-1-2.2-2.2v-8.8Z"
          />
        </svg>
      </div>
      <button
        onClick={handleToggle}
        className="absolute top-20 right-5 lg:right-20 z-20 w-10 h-10 cursor-pointer"
        aria-label={isDay ? "Passa a notte" : "Passa a giorno"}
      >
        <svg
          id="Livello_1"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 0 40 40"
        >
          <path id="square" className="st2" d="M39.1.9H.9v38.3h38.3V.9Z" />
          <path
            id="moon"
            className="st0"
            style={{ opacity: 0, pointerEvents: "none" }}
            d="M30.5,20.5c0,1.8-.7,3.6-1.8,5.1-1.1,1.5-2.6,2.6-4.3,3.3-1.7.7-3.6.8-5.4.4-1.8-.4-3.4-1.3-4.7-2.6-1.3-1.3-2.2-2.9-2.6-4.7-.4-1.8-.2-3.7.4-5.4.7-1.7,1.8-3.2,3.3-4.3,1.5-1.1,3.3-1.7,5.1-1.8.4,0,.7.5.4.8-.8,1.2-1.1,2.7-.9,4.1s.8,2.8,1.8,3.8,2.3,1.7,3.8,1.8c1.4.2,2.9-.2,4.1-.9.4-.2.9,0,.8.4Z"
          />
          <path
            id="sun"
            className="st1"
            d="M20,24.4c2.4,0,4.4-2,4.4-4.4s-2-4.4-4.4-4.4-4.4,2-4.4,4.4,2,4.4,4.4,4.4Z
              M20,9v4.5
              M20,26.5v4.5
              M12.2,12.2l3.1,3.1
              M24.6,24.6l3.2,3.2
              M9,20h4.5
              M26.5,20h4.5
              M15.3,24.7l-3.1,3.1
              M27.8,12.2l-3.1,3.1"
          />
        </svg>
      </button>
    </section>
  );
};
