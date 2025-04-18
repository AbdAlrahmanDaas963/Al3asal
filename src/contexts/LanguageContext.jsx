// src/contexts/LanguageContext.js
import React, { createContext, useState, useEffect } from "react";
import i18n from "i18next";

export const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
  // Initialize state from localStorage or default to 'en'
  const [language, setLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem("language");
    return savedLanguage || "en";
  });

  // Direction is derived from language, no need for separate state
  const direction = language === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    // Update i18n language
    i18n.changeLanguage(language);

    // Update document direction
    document.documentElement.dir = direction;
    document.documentElement.lang = language;

    // Persist to localStorage
    localStorage.setItem("language", language);
  }, [language, direction]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));
  };

  return (
    <LanguageContext.Provider value={{ language, direction, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export default LanguageProvider;
