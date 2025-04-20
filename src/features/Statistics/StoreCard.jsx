import React from "react";
import { Stack, Typography, Chip, Box } from "@mui/material";
import { useTranslation } from "react-i18next";

const StoreCard = ({ image, name, revenue, rank }) => {
  const { t } = useTranslation("cards");
  // Handle name (string or {ar, en} object)
  const getName = () => {
    if (!name) return "N/A";
    if (typeof name === "string") return name;
    if (name.ar && name.en)
      return (
        <>
          <span style={{ direction: "rtl" }}>{name.ar}</span>
          <span> / </span>
          <span>{name.en}</span>
        </>
      );
    return name.ar || name.en || "N/A";
  };

  // Format revenue
  const getRevenue = () => {
    if (revenue === undefined || revenue === null) return null;
    const amount =
      typeof revenue === "number" ? revenue.toLocaleString() : revenue;
    return `$${amount}`;
  };

  return (
    <Box
      sx={{
        width: "300px",
        height: "100%",
        backgroundColor: "#252525",
        padding: "10px",
        borderRadius: "20px",
        color: "#fff",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        fontFamily: name?.ar ? "'Tajawal', sans-serif" : "'Roboto', sans-serif",
      }}
    >
      {/* Rank Badge */}
      {typeof rank === "number" && (
        <Chip
          label={`#${rank}`}
          color="primary"
          size="small"
          sx={{
            position: "absolute",
            top: 10,
            left: 10,
            zIndex: 1,
            fontFamily: "'Roboto', sans-serif",
          }}
        />
      )}

      {/* Store Image */}
      <Box
        sx={{
          width: "100%",
          paddingTop: "100%",
          position: "relative",
          borderRadius: "16px",
          overflow: "hidden",
          backgroundColor: "grey",
          mb: 1,
        }}
      >
        <img
          src={image || "https://via.placeholder.com/150"}
          alt={
            typeof name === "string" ? name : name?.ar || name?.en || "Store"
          }
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/150";
          }}
        />
      </Box>

      {/* Store Info */}
      <Stack spacing={1}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="body2" color="text.secondary">
            {t("store.name")}
          </Typography>
          <Typography
            variant="body1"
            fontWeight="bold"
            sx={{
              textAlign: name?.ar ? "right" : "left",
              direction: name?.ar ? "rtl" : "ltr",
            }}
          >
            {getName()}
          </Typography>
        </Stack>

        {revenue !== undefined && revenue !== null && (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="body2" color="text.secondary">
              {t("store.revenue")}
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {getRevenue()}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default StoreCard;
