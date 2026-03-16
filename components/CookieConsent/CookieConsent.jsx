// components/CookieConsent.tsx
"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import * as CookieConsent from "vanilla-cookieconsent";
import "vanilla-cookieconsent/dist/cookieconsent.css";

export default function CookieConsentBanner() {
  const t = useTranslations("cookieConsent");
  const locale = useLocale();
  const [consentGiven, setConsentGiven] = useState(false);
  useEffect(() => {
    CookieConsent.run({
      // Forza nuovo consenso se la revisione cambia
      revision: 1,

      // Salva il consenso in un cookie
      cookie: {
        name: "cc_cookie",
        expiresAfterDays: 365,
      },

      // Configurazione UI
      guiOptions: {
        consentModal: {
          layout: "box", // box | cloud | bar
          position: "bottom right", // come Complianz default
          equalWeightButtons: false,
          flipButtons: false,
        },
        preferencesModal: {
          layout: "box",
          position: "right", // il modal laterale come Complianz
          equalWeightButtons: false,
          flipButtons: false,
        },
      },
      onConsent: () => {
        setConsentGiven(true);
      },
      onChange: () => {
        setConsentGiven(true);
      },

      // Categorie cookie
      categories: {
        necessary: {
          enabled: true,
          readOnly: true, // non disattivabile
        },
        functional: {
          enabled: false,
          autoClear: {
            cookies: [{ name: /^_functional/ }],
          },
        },
        analytics: {
          enabled: false,
          autoClear: {
            cookies: [{ name: /^_ga/ }, { name: "_gid" }, { name: /^_gat/ }],
          },
          // Abilita Google Analytics solo con consenso
          services: {
            ga4: {
              label: "Google Analytics 4",
              onAccept: () => {
                // Inizializza GA4
                window.gtag?.("consent", "update", {
                  analytics_storage: "granted",
                });
              },
              onReject: () => {
                window.gtag?.("consent", "update", {
                  analytics_storage: "denied",
                });
              },
            },
          },
        },
        marketing: {
          enabled: true,
          autoClear: {
            cookies: [{ name: /^_fbp/ }, { name: /^_fbc/ }],
          },
          services: {
            metaPixel: {
              label: "Meta Pixel",
              onAccept: () => {
                window.fbq?.("consent", "grant");
              },
              onReject: () => {
                window.fbq?.("consent", "revoke");
              },
            },
            googleAds: {
              label: "Google Ads",
              onAccept: () => {
                window.gtag?.("consent", "update", {
                  ad_storage: "granted",
                });
              },
              onReject: () => {
                window.gtag?.("consent", "update", {
                  ad_storage: "denied",
                });
              },
            },
          },
        },
      },

      // Testi in italiano
      language: {
        default: locale,
        translations: {
          it: {
            consentModal: {
              title: "Utilizziamo i cookie 🍪",
              description:
                "Utilizziamo i cookie per migliorare la tua esperienza di navigazione, " +
                "mostrarti contenuti personalizzati e analizzare il traffico del sito. " +
                '<a href="/cookie-policy" class="cc__link">Leggi la Cookie Policy</a>',
              acceptAllBtn: "Accetta tutti",
              acceptNecessaryBtn: "Rifiuta tutti",
              showPreferencesBtn: "Gestisci preferenze",
              footer: `
                <a href="/privacy-policy">Privacy Policy</a>
                <a href="/cookie-policy">Cookie Policy</a>
              `,
            },
            preferencesModal: {
              title: "Preferenze cookie",
              acceptAllBtn: "Accetta tutti",
              acceptNecessaryBtn: "Rifiuta tutti",
              savePreferencesBtn: "Salva preferenze",
              closeIconLabel: "Chiudi",
              serviceCounterLabel: "Servizi",
              sections: [
                {
                  title: "Utilizzo dei Cookie",
                  description:
                    "Utilizziamo cookie e tecnologie simili per migliorare la tua " +
                    "esperienza sul nostro sito. Puoi scegliere quali categorie " +
                    "accettare qui sotto.",
                },
                {
                  title:
                    'Cookie Necessari <span class="pm__badge">Sempre attivi</span>',
                  description:
                    "Questi cookie sono essenziali per il funzionamento del sito " +
                    "e non possono essere disattivati.",
                  linkedCategory: "necessary",
                  cookieTable: {
                    headers: {
                      name: "Nome",
                      domain: "Dominio",
                      desc: "Descrizione",
                      duration: "Durata",
                    },
                    body: [
                      {
                        name: "cc_cookie",
                        domain: "iltridentepositano.com",
                        desc: "Salva le preferenze sui cookie",
                        duration: "1 anno",
                      },
                    ],
                  },
                },
                {
                  title: "Cookie Funzionali",
                  description:
                    "Permettono funzionalità avanzate come chat, video e preferenze utente.",
                  linkedCategory: "functional",
                },
                {
                  title: "Cookie Analitici",
                  description:
                    "Ci aiutano a capire come i visitatori interagiscono con il sito, " +
                    "raccogliendo informazioni in forma anonima.",
                  linkedCategory: "analytics",
                  cookieTable: {
                    headers: {
                      name: "Nome",
                      domain: "Dominio",
                      desc: "Descrizione",
                      duration: "Durata",
                    },
                    body: [
                      {
                        name: "_ga",
                        domain: "iltridentepositano.com",
                        desc: "Google Analytics - distingue gli utenti",
                        duration: "2 anni",
                      },
                      {
                        name: "_gid",
                        domain: "iltridentepositano.com",
                        desc: "Google Analytics - distingue gli utenti",
                        duration: "24 ore",
                      },
                    ],
                  },
                },
                {
                  title: "Cookie di Marketing",
                  description:
                    "Utilizzati per mostrarti pubblicità pertinente in base " +
                    "ai tuoi interessi.",
                  linkedCategory: "marketing",
                  cookieTable: {
                    headers: {
                      name: "Nome",
                      domain: "Dominio",
                      desc: "Descrizione",
                      duration: "Durata",
                    },
                    body: [
                      {
                        name: "_fbp",
                        domain: "iltridentepositano.com",
                        desc: "Meta Pixel - tracciamento conversioni",
                        duration: "3 mesi",
                      },
                    ],
                  },
                },
                {
                  title: "Ulteriori informazioni",
                  description:
                    "Per qualsiasi domanda relativa alla nostra policy sui cookie, " +
                    '<a class="cc__link" href="/contatti">contattaci</a>.',
                },
              ],
            },
          },
          en: {
            consentModal: {
              title: "We use cookies 🍪",
              description:
                "We use cookies to improve your browsing experience, " +
                "show you personalized content, and analyze site traffic. " +
                '<a href="/cookie-policy" class="cc__link">Read our Cookie Policy</a>',
              acceptAllBtn: "Accept all",
              acceptNecessaryBtn: "Reject all",
              showPreferencesBtn: "Manage preferences",
              footer: `
                <a href="/privacy-policy">Privacy Policy</a>
                <a href="/cookie-policy">Cookie Policy</a>
              `,
            },
            preferencesModal: {
              title: "Cookie Preferences",
              acceptAllBtn: "Accept all",
              acceptNecessaryBtn: "Reject all",
              savePreferencesBtn: "Save preferences",
              closeIconLabel: "Close",
              serviceCounterLabel: "Services",
              sections: [
                {
                  title: "Cookie Usage",
                  description:
                    "We use cookies and similar technologies to improve your " +
                    "experience on our site. You can choose which categories " +
                    "to accept below.",
                },
                {
                  title:
                    'Necessary Cookies <span class="pm__badge">Always Active</span>',
                  description:
                    "These cookies are essential for the website to function " +
                    "and cannot be disabled.",
                  linkedCategory: "necessary",
                  cookieTable: {
                    headers: {
                      name: "Name",
                      domain: "Domain",
                      desc: "Description",
                      duration: "Duration",
                    },
                    body: [
                      {
                        name: "cc_cookie",
                        domain: "iltridentepositano.com",
                        desc: "Saves cookie preferences",
                        duration: "1 year",
                      },
                    ],
                  },
                },
                {
                  title: "Functional Cookies",
                  description:
                    "Enable advanced features such as live chat, videos and user preferences.",
                  linkedCategory: "functional",
                },
                {
                  title: "Analytics Cookies",
                  description:
                    "Help us understand how visitors interact with the site " +
                    "by collecting anonymous information.",
                  linkedCategory: "analytics",
                  cookieTable: {
                    headers: {
                      name: "Name",
                      domain: "Domain",
                      desc: "Description",
                      duration: "Duration",
                    },
                    body: [
                      {
                        name: "_ga",
                        domain: "iltridentepositano.com",
                        desc: "Google Analytics - distinguishes users",
                        duration: "2 years",
                      },
                      {
                        name: "_gid",
                        domain: "iltridentepositano.com",
                        desc: "Google Analytics - distinguishes users",
                        duration: "24 hours",
                      },
                    ],
                  },
                },
                {
                  title: "Marketing Cookies",
                  description:
                    "Used to show you relevant advertising based on " +
                    "your interests.",
                  linkedCategory: "marketing",
                  cookieTable: {
                    headers: {
                      name: "Name",
                      domain: "Domain",
                      desc: "Description",
                      duration: "Duration",
                    },
                    body: [
                      {
                        name: "_fbp",
                        domain: "iltridentepositano.com",
                        desc: "Meta Pixel - conversion tracking",
                        duration: "3 months",
                      },
                    ],
                  },
                },
                {
                  title: "More information",
                  description:
                    "For any questions regarding our cookie policy, " +
                    '<a class="cc__link" href="/contact">contact us</a>.',
                },
              ],
            },
          },
        },
      },
    });

    if (CookieConsent.validConsent()) {
      setConsentGiven(true);
    }
  }, [locale]);

  if (!consentGiven) return null;

  return (
    <button
      onClick={() => CookieConsent.show(true)}
      aria-label={t("manageConsent")}
      className="fixed bottom-0 translate-y-2/3 right-4 z-50 bg-cardspranzo rounded-t-lg py-3 px-5 shadow-xl hover:shadow-2xl/40 transition-all duration-500 ease-in-out hover:translate-y-0"
    >
      {t("manageConsent")}
    </button>
  );
}
