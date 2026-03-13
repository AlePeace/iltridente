"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "../../i18n/navigation";
import { routing } from "../../i18n/routing";

export const LanguageSwitcher = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleChange = (newLocale) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div className="flex items-center">
      {routing.locales.map((loc, index) => (
        <div  key={loc} className="flex items-center">
          {index > 0 && <span className="text-text/50 -mt-1 select-none">|</span>}
          <button
            onClick={() => handleChange(loc)}
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
