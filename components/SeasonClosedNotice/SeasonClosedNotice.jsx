import { useTranslations } from "next-intl";

// Messaggio di chiusura invernale, condiviso tra il popup (SeasonPopup) e la
// pagina Prenotazioni (ReservationPage). Testi in messages/*.json -> seasonPopup.
const HOTEL_INSTAGRAM_URL = "https://www.instagram.com/hotelposeidonpositano/";
const EDERA_INSTAGRAM_URL = "https://www.instagram.com/ederapositano/";

const buttonClasses =
  "inline-flex items-center justify-center w-full sm:w-auto py-3 px-8 rounded-md font-nunito font-semibold tracking-wider text-sm transition-colors duration-300";

export const SeasonClosedNotice = ({ titleId, titleAs: Title = "p" }) => {
  const t = useTranslations("seasonPopup");
  // La riga EdEra c'è solo nel testo inglese fornito dalla cliente.
  const hasEdera = t.has("ederaText");

  return (
    <div className="text-center">
      <Title
        id={titleId}
        className="font-cinzel text-red text-2xl sm:text-3xl leading-snug uppercase tracking-wider"
      >
        {t("title")}
      </Title>

      <p className="mt-6 font-nunito text-text text-base sm:text-lg leading-relaxed">
        {t("text")}
      </p>
      <p className="mt-4 font-nunito text-text text-base sm:text-lg font-semibold">
        {t("closing")}
      </p>

      <div className="mt-6 flex justify-center">
        <a
          href={HOTEL_INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonClasses} bg-red text-white hover:bg-[#8a5a63]`}
        >
          {t("hotelInstagram")}
        </a>
      </div>

      {hasEdera && (
        <div className="mt-10 pt-8 border-t border-text/15">
          <p className="font-nunito text-text text-base leading-relaxed">
            {t("ederaText")}
          </p>
          <div className="mt-4 flex justify-center">
            <a
              href={EDERA_INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${buttonClasses} bg-buttonno text-white hover:bg-[#2a3a4f]`}
            >
              {t("ederaButton")}
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
