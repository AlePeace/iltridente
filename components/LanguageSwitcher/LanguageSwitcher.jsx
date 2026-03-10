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
    <div className="flex gap-2 items-center">
      {routing.locales.map((loc) => (
        <button
          key={loc}
          onClick={() => handleChange(loc)}
          className={`text-sm uppercase font-semibold px-2 py-1 rounded transition-colors cursor-pointer ${
            locale === loc ? "bg-red text-white" : "text-red hover:bg-red/10"
          }`}
        >
          {loc}
        </button>
      ))}
    </div>
  );
};
