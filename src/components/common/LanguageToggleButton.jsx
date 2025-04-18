// src/components/common/LanguageToggleButton.js
import React, { useContext } from "react";
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../contexts/LanguageContext";

const LanguageToggleButton = () => {
  const { t } = useTranslation("common");
  const { language, toggleLanguage } = useContext(LanguageContext);

  return (
    <Button
      variant="outlined"
      color="white"
      size="small"
      onClick={toggleLanguage}
      sx={{
        minWidth: 80,
        textTransform: "uppercase",
      }}
    >
      {language === "en" ? "AR" : "EN"}
    </Button>
  );
};

export default LanguageToggleButton;
