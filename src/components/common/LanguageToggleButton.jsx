import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";

const LanguageToggleButton = ({ setDirection }) => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    setDirection(newLang === "ar" ? "rtl" : "ltr");
    localStorage.setItem("language", newLang);
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
      setDirection(savedLanguage === "ar" ? "rtl" : "ltr");
    }
  }, [i18n, setDirection]);

  return (
    <Button variant="contained" onClick={toggleLanguage}>
      {t("toggleLanguage")}
    </Button>
  );
};

export default LanguageToggleButton;
