"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { FiX } from "react-icons/fi";
import { SeasonClosedNotice } from "components/SeasonClosedNotice";
import { SEASON_CLOSED } from "utils/seasonFlags";

// Popup di chiusura invernale: compare una sola volta per sessione del browser
// (non si ripete navigando tra le pagine, riappare alla prossima visita).
// Attivo finché SEASON_CLOSED (utils/seasonFlags.js) è true.
const SESSION_KEY = "season_closed_popup_seen";
const SHOW_DELAY = 1000; // ms prima della comparsa (subito all'accesso)
// Immagine statica in /public (nessun media WordPress): foto a sinistra.
const POPUP_IMG = "/season/pranzo-il-tridente-positano.webp";

export default function SeasonPopup() {
  const t = useTranslations("seasonPopup");
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
    if (!SEASON_CLOSED) return;
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
      aria-labelledby="season-popup-title"
      onClick={close}
      className={`fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 transition-opacity duration-300 ease-out ${
        open ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full max-w-275 max-h-[calc(100svh-2rem)] overflow-y-auto lg:overflow-hidden bg-white border-4 border-cardspranzo rounded-lg shadow-2xl flex flex-col lg:flex-row transition-all duration-300 ease-out ${
          open ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Bottone chiudi (sfondo bianco: su mobile sta sopra la foto) */}
        <button
          onClick={close}
          aria-label={t("closeLabel")}
          className="absolute top-4 right-4 z-20 grid place-items-center w-10 h-10 rounded-full border border-text/30 bg-white/90 text-text hover:bg-cardspranzo transition-colors duration-300 cursor-pointer"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Colonna immagine */}
        <div className="relative w-full lg:w-1/2 h-[22svh] sm:h-[38svh] lg:h-auto lg:min-h-175 shrink-0">
          <Image
            src={POPUP_IMG}
            alt={t("imageAlt")}
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
            priority
          />
        </div>

        {/* Colonna testo */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 py-10 sm:px-12 sm:py-12">
          <SeasonClosedNotice titleId="season-popup-title" />
        </div>
      </div>
    </div>
  );
}
