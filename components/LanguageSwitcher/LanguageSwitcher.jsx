"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "../../i18n/navigation";
import { routing } from "../../i18n/routing";
import { useAlternates } from "context/AlternatesContext";

export const LanguageSwitcher = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const { alternates } = useAlternates();

  const handleSwitch = (loc) => {
    const wpUri = alternates[loc];

    if (wpUri) {
      // Rimuove il prefisso /locale/ dall'URI di WP per ottenere il path next-intl
      let path = wpUri;
      if (path.startsWith(`/${loc}/`)) {
        path = path.slice(`/${loc}`.length);
      }
      router.replace(path, { locale: loc });
    } else {
      router.replace(pathname, { locale: loc });
    }
  };

  return (
    <div className="flex items-center">
      {routing.locales.map((loc, index) => (
        <div key={loc} className="flex items-center">
          {index > 0 && (
            <span className="text-text/50 -mt-1 select-none">|</span>
          )}
          <button
            onClick={() => handleSwitch(loc)}
            className={`font-nunito font-light text-sm uppercase px-2 py-1 rounded transition-colors cursor-pointer ${
              locale === loc
                ? "!font-bold text-text"
                : "text-text hover:bg-text/10"
            }`}
          >
            {loc}
          </button>
        </div>
      ))}
    </div>
  );
};
