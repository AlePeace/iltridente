import { EventForm } from "components/EventForm/EventForm";

export const EventFormPage = ({blocks}) => {
  const innerBlocks = blocks?.innerBlocks || [];

  return (
    <section className="w-full py-10 lg:py-18 px-5 lg:px-20">
        <div className="max-w-3xl mx-auto">
            <EventForm />
        </div>
    </section>
  )
};
