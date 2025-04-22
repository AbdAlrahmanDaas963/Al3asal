import React from "react";
import { useTranslation } from "react-i18next";
import { Stack, Typography, Chip, Box } from "@mui/material";

const ProductCard = ({ image, name, sales, rank }) => {
  const { t } = useTranslation("cards");
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
      }}
    >
      {/* Rank Badge */}
      {rank && (
        <Chip
          label={`#${rank}`}
          color="primary"
          size="small"
          sx={{ position: "absolute", top: 15, left: 15, zIndex: 1 }}
        />
      )}

      {/* Product Image */}
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
          alt={name || t("notAvailable")}
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

      {/* Product Info */}
      <Stack spacing={1}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="textSecondary">
            {t("product.name")}
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {name || t("notAvailable")}
          </Typography>
        </Stack>

        {sales && (
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="textSecondary">
              {t("product.sales")}
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {sales}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Box>
  );
};

export default ProductCard;
