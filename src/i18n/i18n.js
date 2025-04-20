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

import userFormEn from "./locales/en/userFormEn.json";
import userFormAr from "./locales/ar/userFormAr.json";

import statisticsEn from "./locales/en/statisticsEn.json";
import statisticsAr from "./locales/ar/statisticsAr.json";

import cardsEn from "./locales/en/cardsEn.json";
import cardsAr from "./locales/ar/cardsAr.json";

import productsEn from "./locales/en/productsEn.json";
import productsAr from "./locales/ar/productsAr.json";

import productFormEn from "./locales/en/productFormEn.json";
import productFormAr from "./locales/ar/productFormAr.json";

import addProductFormEn from "./locales/en/addProductFormEn.json";
import addProductFormAr from "./locales/ar/addProductFormAr.json";

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
      userForm: userFormEn,
      statistics: statisticsEn,
      cards: cardsEn,
      products: productsEn,
      productForm: productFormEn,
      addProductForm: addProductFormEn,
    },
    ar: {
      common: commonAr,
      home: homeAr,
      dashboard: dashboardAr,
      drawer: drawerAr,
      homeDash: homeDashAr,
      ordersTable: ordersTableAr,
      orderDetails: orderDetailsAr,
      userForm: userFormAr,
      statistics: statisticsAr,
      cards: cardsAr,
      products: productsAr,
      productForm: productFormAr,
      addProductForm: addProductFormAr,
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
    "userForm",
    "statistics",
    "cards",
    "products",
    "productForm",
    "addProductForm",
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
