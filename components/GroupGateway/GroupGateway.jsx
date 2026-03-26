"use client";

import { Heading } from "components/Heading";
import { Paragraph } from "components/Paragraph";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "../../i18n/navigation";
import { routing } from "../../i18n/routing";
import Image from "next/image";

export const GroupGateway = ({ blocks }) => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleLocaleChange = (newLocale) => {
    router.replace(pathname, { locale: newLocale });
  };

  const innerBlocks = blocks?.innerBlocks || [];
  const image = innerBlocks.find((block) => block.name === "core/image");
  const heading = innerBlocks.find((block) => block.name === "core/heading");
  const paragraph = innerBlocks.find(
    (block) => block.name === "core/paragraph",
  );

  return (
    <section className="py-12 lg:pt-24 max-w-7xl mx-auto px-5 lg:px-20">
      <div className="flex flex-col items-center gap-8 lg:gap-12">
        {image && (
          <div className="flex justify-center overflow-hidden rounded-xl">
            <Image
              width={image.attributes?.width || 600}
              height={image.attributes?.height || 400}
              src={image.attributes?.url}
              alt={image.attributes?.alt || ""}
              quality={100}
              className="object-cover transform-gpu will-change-transform pointer-events-none"
            />
          </div>
        )}
        {heading && (
          <Heading
            level={heading.attributes?.level}
            content={heading.attributes?.content}
            className="font-cinzel uppercase text-red font-normal text-3xl lg:text-4xl tracking-wider text-center"
          />
        )}
        {paragraph && (
          <Paragraph
            content={paragraph.attributes?.content}
            className="font-nunito text-text font-light text-base lg:text-lg text-center max-w-2xl"
          />
        )}
        <div className="flex items-center justify-center">
          {routing.locales.map((loc, index) => (
            <div key={loc} className="flex items-center">
              {index > 0 && (
                <span className="text-red select-none -mt-1">|</span>
              )}
              <button
                onClick={() => handleLocaleChange(loc)}
                className={`font-nunito text-sm uppercase px-2 py-1 rounded transition-colors cursor-pointer text-red ${
                  locale === loc ? "font-bold" : "font-light hover:bg-red/10"
                }`}
              >
                {loc}
              </button>
            </div>
          ))}
        </div>
      </div>
      <style>
        {`
          header{
          display: none;
          }
        `}
      </style>
    </section>
  );
};
