import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        toggleLanguage: "Arabic",
      },
    },
    ar: {
      translation: {
        toggleLanguage: "الإنجليزية",
      },
    },
  },
  lng: localStorage.getItem("language") || "en", // Default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
