import { useTranslations } from "next-intl";
import { EventForm } from "components/EventForm/EventForm";
import { EVENT_REQUESTS_CLOSED } from "utils/seasonFlags";

export const EventFormPage = ({ blocks }) => {
  const t = useTranslations("eventForm");

  return (
    <section className="w-full py-10 lg:py-18 px-5 lg:px-20">
      <div className="max-w-3xl mx-auto">
        {EVENT_REQUESTS_CLOSED ? (
          <p className="font-nunito text-text font-light text-base lg:text-lg text-center">
            {t("closedMessage")}
          </p>
        ) : (
          <EventForm />
        )}
      </div>
    </section>
  );
};
