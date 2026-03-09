"use client";
import { useState } from "react";
import { ReservationForm } from "../ReservationForm/ReservationForm";
import { Heading } from "components/Heading";
import { Paragraph } from "components/Paragraph";

export const ReservationPage = ({ blocks }) => {
  const [showForm, setShowForm] = useState(false);
  const [showQuestion, setShowQuestion] = useState(true);

  // Estrai il contenuto creato in WordPress (il testo introduttivo)
  const innerBlocks = blocks?.innerBlocks || [];
  const headings = innerBlocks.filter((block) => block.name === "core/heading");
  const paragraphs = innerBlocks.filter(
    (block) => block.name === "core/paragraph",
  );

  const titleForm = headings[0];
  const introText = paragraphs[0];
  const titlePolicyRestaurant = headings[1];

  const listTitles = innerBlocks.filter(
    (block) =>
      block.name === "core/heading" &&
      block.attributes?.className?.includes("title-list-prenotazioni"),
  );
  const listParagraphs = innerBlocks.filter(
    (block) =>
      block.name === "core/paragraph" &&
      block.attributes?.className?.includes("parapograph-list-prenotazioni"),
  );

  return (
    <section className="py-24 lg:py-28 px-5 lg:px-40 relative overflow-hidden">
      <div className="absolute top-24 lg:top-28 right-0 w-1/2 lg:w-1/4 -mr-5 -scale-x-100">
        <svg
          id="Livello_1"
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          viewBox="0 0 333 233.5"
        >
          <path
            className="onde1"
            d="M103.9,193.5c-12,18.7-57.6,34.8-103.9,35v-53.1c74.4,13.5,74.3-31.9,41.9-49.4-33.9-18.4,110.6-8.8,62,67.5Z"
          />
          <path
            className="onde1"
            d="M0,26.3c21.5-8.4,42.9-14.1,62.5-13.8,61.2,1,80.9,51.6,131,60.8,74.8,13.8,74.8-31.7,42.4-49.4-33.9-18.4,110.6-8.8,62,67.5-21.5,33.7-152,58.7-199.2-1.5C74.1,58.7,35.4,56.2,0,62.8V26.3Z"
          />
          <polyline
            className="onde0"
            points="0 -6.5 0 26.3 0 62.8 0 175.5 0 228.5"
          />
        </svg>
      </div>
      <div className="flex flex-col gap-10 lg:flex-row max-w-7xl">
        <div className="lg:basis-1/2 lg:mt-20 bg-cardspranzo/50 border-cardspranzo border-4 py-10 px-5 rounded-lg h-fit">
          {/* Contenuto da WordPress (testo introduttivo) */}
          {titleForm && (
            <Heading
              key={titleForm.id}
              className="font-cinzel text-center text-red text-2xl md:text-3xl mb-6 uppercase tracking-wider"
              level={titleForm.attributes?.level}
              content={titleForm.attributes?.content}
            />
          )}
          {introText && (
            <Paragraph
              key={introText.id}
              className="font-nunito text-text leading-relaxed mb-4 text-[15px]"
              content={introText.attributes?.content}
            />
          )}
          {/* Domanda Hotel Poseidon */}
          {showQuestion && !showForm && (
            <div className="mt-8 rounded-lg p-8 text-center">
              <p className="font-nunito text-lg font-semibold text-text mb-6">
                Hai una prenotazione all&apos;Hotel Poseidon?
              </p>
              <div className="flex w-full gap-4 justify-center">
                <button
                  onClick={() => {
                    setShowForm(true);
                    setShowQuestion(false);
                  }}
                  className="bg-red text-white px-10 py-3 rounded-md
                                 hover:bg-[#8a5a63] transition-colors duration-300
                                 font-semibold tracking-wider uppercase text-sm min-w-[120px] w-full"
                >
                  Sì
                </button>
                <button
                  onClick={() => {
                    setShowQuestion(false);
                  }}
                  className="bg-buttonno text-white px-10 py-3 rounded-md
                                 hover:bg-[#2a3a4f] transition-colors duration-300
                                 font-semibold tracking-wider uppercase text-sm min-w-[120px] w-full"
                >
                  No
                </button>
              </div>
            </div>
          )}
          {/* Messaggio dopo aver cliccato "No" */}
          {!showQuestion && !showForm && (
            <div className="mt-8 border rounded-lg p-8 text-center">
              <p className="font-nunito text-text leading-relaxed mb-4">
                I tavoli possono essere prenotati con un massimo di{" "}
                <strong>14 giorni d&apos;anticipo</strong> tramite il calendario
                presente in basso, che mostra in tempo reale le disponibilità
                per le successive due settimane.
              </p>
              <button
                onClick={() => {
                  setShowQuestion(true);
                }}
                className="text-[#A86F79] underline hover:text-[#8a5a63] text-sm mt-4 transition-colors"
              >
                ← Torna indietro
              </button>
            </div>
          )}
          {/* Form di prenotazione (appare dopo "Sì") */}
          {showForm && (
            <div className="mt-8 animate-fadeIn">
              <ReservationForm />
              <div className="text-center mt-4">
                <button
                  onClick={() => {
                    setShowForm(false);
                    setShowQuestion(true);
                  }}
                  className="text-[#A86F79] underline hover:text-[#8a5a63] text-sm transition-colors"
                >
                  ← Torna indietro
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="lg:basis-1/2">
          <div>
            <div>
              {titlePolicyRestaurant && (
                <Heading
                  key={titlePolicyRestaurant.id}
                  className="font-nunito text-dust text-xl md:text-2xl mb-6"
                  level={titlePolicyRestaurant.attributes?.level}
                  content={titlePolicyRestaurant.attributes?.content}
                />
              )}
            </div>
            <div>
              {listTitles.map((title, index) => (
                <div
                  key={title.id || index}
                  className="border-l-4 border-dust my-10 px-5 space-y-3"
                >
                  <Heading
                    level={title.attributes?.level}
                    content={title.attributes?.content}
                    className="font-nunito text-base font-medium text-text"
                  />
                  {/* Accoppia ogni titolo al paragrafo con lo stesso indice */}
                  {listParagraphs[index] && (
                    <Paragraph
                      content={listParagraphs[index].attributes?.content}
                      className="font-nunito text-text font-light text-sm lg:text-base"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
