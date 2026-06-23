"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { FiInstagram, FiX } from "react-icons/fi";

// Chiave di sessione: il popup compare una sola volta per sessione del browser
// (non si ripete navigando tra le pagine, riappare alla prossima visita).
const SESSION_KEY = "edera_popup_seen";
const SHOW_DELAY = 3000; // ms prima della comparsa
const GREEN = "#0F5744";
const INSTAGRAM_URL = "https://www.instagram.com/ederapositano";
const WEBSITE_URL = "https://www.ederapositano.com";

// Immagini statiche in /public (nessun media WordPress).
// Vanno aggiunte qui:
//   public/edera/secret-bar-cocktail.webp → foto a sinistra
//   public/edera/secret-bar-bg.webp       → sfondo sfumato del pannello verde
const COCKTAIL_IMG = "/edera/secret-bar-cocktail.webp";
const PANEL_BG_IMG = "/edera/secret-bar-bg.webp";

export default function EderaPopup() {
  const t = useTranslations("ederaPopup");
  const [mounted, setMounted] = useState(false); // se renderizzare nel DOM
  const [open, setOpen] = useState(false); // stato per le transizioni in/out

  const close = useCallback(() => {
    setOpen(false);
    // attende la transizione di uscita prima di smontare
    setTimeout(() => setMounted(false), 400);
  }, []);

  // Comparsa ritardata, una volta per sessione
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const timer = setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, "1");
      setMounted(true);
      // doppio rAF: monta a opacità 0, poi anima verso lo stato aperto
      requestAnimationFrame(() => requestAnimationFrame(() => setOpen(true)));
    }, SHOW_DELAY);

    return () => clearTimeout(timer);
  }, []);

  // Chiusura con ESC
  useEffect(() => {
    if (!mounted) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mounted, close]);

  if (!mounted) return null;

  return (
    <div
      // data-lenis-prevent: blocca lo smooth-scroll di Lenis mentre il popup è aperto
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-label={`${t("titleLine1")} ${t("titleLine2")}`}
      onClick={close}
      className={`fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 transition-opacity duration-300 ease-out ${
        open ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-275 max-h-[calc(100svh-2rem)] overflow-y-auto lg:overflow-hidden rounded-[10px] lg:rounded-xl flex flex-col lg:flex-row shadow-2xl transition-all duration-300 ease-out ${
          open ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        style={{ backgroundColor: GREEN }}
      >
        {/* Bottone chiudi */}
        <button
          onClick={close}
          aria-label={t("closeLabel")}
          className="absolute top-4 right-4 z-20 grid place-items-center w-10 h-10 rounded-full border border-white/60 text-white hover:bg-white/15 transition-colors duration-300 cursor-pointer"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Colonna immagine */}
        <div className="relative w-full lg:w-1/2 h-[22svh] sm:h-[38svh] lg:h-auto lg:min-h-175 shrink-0">
          <Image
            src={COCKTAIL_IMG}
            alt={`${t("titleLine1")} ${t("titleLine2")}`}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Colonna pannello verde */}
        <div
          className="relative w-full lg:w-1/2 flex flex-col items-center justify-center text-center text-white px-6 py-6 sm:px-10 sm:py-10 lg:px-12 overflow-hidden"
          style={{ backgroundColor: GREEN }}
        >
          {/* Foto di sfondo (degrada in modo silenzioso se manca il file) */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-center bg-cover pointer-events-none"
            style={{ backgroundImage: `url(${PANEL_BG_IMG})` }}
          />
          {/* Overlay verde #0F5744 al 90% sopra la foto */}
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{ backgroundColor: GREEN, opacity: 0.9 }}
          />

          <div className="relative z-10 flex flex-col items-center">
            <h2 className="font-cinzel uppercase leading-[1.05] text-4xl sm:text-5xl lg:text-[3.4rem] font-normal">
              <span className="block">{t("titleLine1")}</span>
              <span className="block">{t("titleLine2")}</span>
            </h2>

            <p className="mt-3 font-fauna uppercase text-base sm:text-lg text-edera">
              {t("isOpen")}
            </p>

            <svg
              aria-hidden="true"
              className="my-3 sm:my-4"
              width="37"
              height="33"
              viewBox="0 0 37 33"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M36.9765 16.6936C37.0642 16.3436 36.9181 15.9643 36.5966 15.7893C34.2298 14.3891 30.2558 13.6306 27.1 14.3891C26.8663 12.172 26.0189 9.8674 25.1715 8.11708C24.4117 6.60014 23.5643 5.17071 22.5416 3.79963C21.4897 2.45772 20.6131 0.999125 19.1228 0.123966C18.8891 -0.0218934 18.6553 -0.0218934 18.4508 0.0364505C17.1066 -0.0802373 15.1781 3.01199 14.506 3.79963C12.519 6.51263 10.8535 9.57568 10.123 12.9305C10.0645 13.3972 9.97686 13.8931 9.94764 14.4474C6.82105 13.5431 3.28538 14.2432 0.392564 15.7893C0.10036 15.9643 -0.045742 16.3144 0.0126989 16.6936C0.275683 17.773 0.597107 18.7357 0.976972 19.7275C2.08735 22.4697 3.81135 25.0368 6.23665 26.6704C5.56458 28.3624 5.18471 30.1711 6.0321 31.9506C6.11976 32.1548 6.29509 32.3006 6.52885 32.359C8.8957 32.9716 11.5255 33.0299 13.834 32.0673C13.9801 32.0089 14.0969 31.9506 14.243 31.8922L13.7755 30.8129C13.7755 30.8129 13.5417 30.9004 13.4249 30.9296C11.5548 31.6297 9.24635 31.513 7.40546 30.842C7.11326 29.9669 7.28858 28.7708 7.61 27.8665C7.81455 27.0789 8.66194 26.1745 7.75611 25.5911C4.65874 23.8116 2.78864 20.3693 1.85358 16.927C3.89901 15.8185 7.3178 15.1767 9.91842 15.8477C9.91842 17.773 10.5028 19.7275 12.3145 20.311C13.7463 20.6027 14.6813 19.465 14.3307 18.1814C14.0969 17.1312 13.4541 16.4019 12.7528 15.8185C12.2268 15.4684 11.6716 15.1475 11.1457 14.9141C11.584 11.2093 13.8047 7.97122 16.0547 5.11237C16.8144 4.09135 17.7203 3.27454 18.48 2.25352C20.1748 4.49976 22.2786 6.51262 23.6228 9.02141C24.6455 10.7426 25.5513 12.7846 25.7851 14.8266C24.2949 15.4684 23.1553 16.5186 22.6001 18.1814C22.0449 20.3985 24.6747 21.0694 25.9312 19.4941C26.6909 18.4148 27.0124 17.2187 27.0708 15.906C29.7006 15.1767 32.7396 15.731 35.0772 16.9854C34.1421 20.3985 32.3012 23.8408 29.2039 25.6203C28.2688 26.1745 29.1162 27.1372 29.3208 27.8957C29.6422 28.8 29.8467 29.996 29.5253 30.8712C27.7136 31.5422 25.4345 31.6589 23.5643 30.9879C23.4767 30.9879 23.389 30.9296 23.3014 30.9004L23.0092 32.0673C23.1845 32.1256 23.3306 32.1839 23.5059 32.2423C24.9961 32.7966 26.6617 32.9424 28.2396 32.7966C28.9993 32.709 29.7299 32.5632 30.4311 32.3882C30.6357 32.3882 30.8402 32.1839 30.9279 31.9797C31.7753 30.2003 31.3954 28.3916 30.6941 26.7288C31.3954 26.262 32.0383 25.7369 32.5935 25.1535C34.8142 22.8197 36.1876 19.8734 36.9181 16.7228L36.9765 16.6936ZM13.1911 18.4148C13.2495 18.7065 13.1911 18.9982 13.1911 19.0566C13.1327 19.0566 13.1911 19.0566 13.1034 19.0566C13.1034 19.0566 13.0158 19.1149 12.9573 19.1149C11.6132 19.2316 11.2333 17.5396 11.1457 16.2561C12.0807 16.7228 12.8112 17.4229 13.2203 18.3856L13.1911 18.4148ZM25.6098 17.8313C25.3176 18.7357 24.6163 19.465 23.8566 19.0857C23.5643 18.2981 24.3533 17.3646 25.0254 16.8687C25.2884 16.6645 25.6098 16.5186 25.902 16.3727C25.902 16.8687 25.7851 17.3646 25.639 17.8605L25.6098 17.8313Z"
                fill="#FAFAF9"
              />
              <path
                d="M23.3607 30.9004C21.7536 30.3169 20.0296 29.2959 18.9192 28.1874C19.9419 26.7288 20.5263 25.066 19.2991 23.7241C18.2764 22.8197 16.8446 23.1698 16.4063 24.3075C16.0264 25.1827 16.2017 25.9995 16.4647 26.7871C16.6985 27.3122 16.9907 27.8081 17.3413 28.2457C16.2309 29.3834 15.2667 30.2586 13.4258 30.9587L13.8349 32.0964C13.8349 32.0964 14.0978 31.9797 14.244 31.9214C15.2959 31.4838 16.3478 30.8712 17.166 30.1711C17.4582 29.8794 17.8088 29.5585 18.1303 29.1792C19.3867 30.4628 21.2276 31.4255 23.0685 32.0673C23.2438 32.1256 23.3899 32.1839 23.5653 32.2423L23.6237 30.9879C23.6237 30.9879 23.4484 30.9295 23.3607 30.9004ZM18.1595 27.2539C17.6043 26.4662 17.3705 25.6203 17.5751 24.6867C17.6627 24.4242 17.8673 24.2492 17.9257 24.2492C17.9257 24.2492 17.9257 24.2492 18.0134 24.2492C18.0718 24.2492 18.1303 24.2492 18.1887 24.2492C19.3867 24.8326 18.8023 26.2329 18.1887 27.2247L18.1595 27.2539Z"
                fill="#FAFAF9"
              />
            </svg>

            <p className="font-fauna text-base sm:text-lg leading-relaxed max-w-md">
              {t("description")}
            </p>

            <p className="mt-4 sm:mt-6 font-fauna uppercase text-sm sm:text-base text-edera">
              {t("timeframe")}
            </p>

            <p className="mt-3 sm:mt-4 font-fauna uppercase text-sm sm:text-base text-edera">
              {t("infoLine")}
            </p>

            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center justify-center gap-3 w-full max-w-sm border border-white/70 rounded-none py-3.5 px-6 font-fauna text-sm sm:text-base text-white hover:bg-white hover:text-edera transition-colors duration-300"
            >
              <FiInstagram className="w-5 h-5 shrink-0 text-edera" />
              <span>{t("cta")}</span>
            </a>

            <a
              href={WEBSITE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 font-fauna text-sm text-edera underline-offset-4 hover:underline"
            >
              {t("website")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
