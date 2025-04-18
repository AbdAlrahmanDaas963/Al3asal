// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// English translations
import commonEn from "./locales/en/commonEn.json";
import homeEn from "./locales/en/homeEn.json";
import dashboardEn from "./locales/en/dashboardEn.json";
import drawerEn from "./locales/en/drawerEn.json";
import homeDashEn from "./locales/en/homeDashEn.json";
import ordersTableEn from "./locales/en/ordersTableEn.json";

// Arabic translations
import commonAr from "./locales/ar/commonAr.json";
import homeAr from "./locales/ar/homeAr.json";
import dashboardAr from "./locales/ar/dashboardAr.json";
import drawerAr from "./locales/ar/drawerAr.json";
import homeDashAr from "./locales/ar/homeDashAr.json";
import ordersTableAr from "./locales/ar/ordersTableAr.json";

import orderDetailsEn from "./locales/en/orderDetailsEn.json";
import orderDetailsAr from "./locales/ar/orderDetailsAr.json";

// Initialize with all namespaces
i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: commonEn,
      home: homeEn,
      dashboard: dashboardEn,
      drawer: drawerEn,
      homeDash: homeDashEn,
      ordersTable: ordersTableEn,
      orderDetails: orderDetailsEn,
    },
    ar: {
      common: commonAr,
      home: homeAr,
      dashboard: dashboardAr,
      drawer: drawerAr,
      homeDash: homeDashAr,
      ordersTable: ordersTableAr,
      orderDetails: orderDetailsAr,
    },
  },
  lng: localStorage.getItem("language") || "en",
  fallbackLng: "en",
  ns: [
    "common",
    "home",
    "dashboard",
    "drawer",
    "homeDash",
    "ordersTable",
    "orderDetails",
  ],
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false, // Prevents Suspense issues if not using it
  },
  detection: {
    order: ["localStorage", "navigator"],
    caches: ["localStorage"],
  },
});

export default i18n;
