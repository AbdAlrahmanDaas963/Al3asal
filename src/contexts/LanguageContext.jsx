import React, { createContext, useState, useEffect } from "react";
import i18n from "i18next";

export const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(
    localStorage.getItem("language") || "en"
  );
  const [direction, setDirection] = useState(language === "ar" ? "rtl" : "ltr");

  useEffect(() => {
    i18n.changeLanguage(language);
    setDirection(language === "ar" ? "rtl" : "ltr");
    document.dir = direction;
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
