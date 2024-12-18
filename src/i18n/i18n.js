import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import commonEn from "./locales/en/commonEn.json";
import commonAr from "./locales/ar/commonAr.json";
import homeEn from "./locales/en/homeEn.json";
import homeAr from "./locales/ar/homeAr.json";
import dashboardEn from "./locales/en/dashboardEn.json";
import dashboardAr from "./locales/ar/dashboardAr.json";
import drawerAr from "./locales/ar/drawerAr.json";
import drawerEn from "./locales/en/drawerEn.json";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: commonEn,
      home: homeEn,
      dashboard: dashboardEn,
      drawer: drawerEn,
    },
    ar: {
      common: commonAr,
      home: homeAr,
      dashboard: dashboardAr,
      drawer: drawerAr,
    },
  },
  lng: localStorage.getItem("language") || "en", // Default language
  fallbackLng: "en",
  ns: ["common", "home", "dashboard", "drawer"], // Namespace list
  defaultNS: "common", // Default namespace
  interpolation: {
    escapeValue: false, // React already handles escaping
  },
});

export default i18n;
