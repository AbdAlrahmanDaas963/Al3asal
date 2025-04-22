import { Box, Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteShop } from "../../features/Shops/shopSlice";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { LanguageContext } from "../../contexts/LanguageContext";

function ShopCard({ shop }) {
  const { t } = useTranslation("shops");
  const { language } = useContext(LanguageContext);
  const { id, name, image, is_interested } = shop;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getDisplayName = () => {
    if (typeof name === "string") return name;
    return name?.[language] || name?.en || name?.ar || t("untitledShop");
  };

  const handleEdit = () => {
    navigate(`/dashboard/shops/edit/${id}`, { state: { shop } });
  };

  const handleDelete = () => {
    if (window.confirm(t("deleteConfirmation"))) {
      dispatch(deleteShop(id));
    }
  };

  return (
    <Box dir={language === "ar" ? "rtl" : "ltr"}>
      <Stack
        sx={{
          width: "300px",
          backgroundColor: "#252525",
          padding: "10px",
          borderRadius: "20px",
          position: "relative",
        }}
      >
        <img
          src={image || "https://via.placeholder.com/300x150?text=No+Image"}
          style={{
            width: "100%",
            height: "150px",
            objectFit: "cover",
            borderRadius: "16px",
            backgroundColor: "grey",
          }}
          alt={getDisplayName()}
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/300x150?text=Image+Error";
          }}
        />

        {is_interested === 1 && (
          <Typography
            sx={{
              position: "absolute",
              top: 15,
              right: 15,
              backgroundColor: "primary.main",
              color: "white",
              px: 1,
              borderRadius: 1,
              fontSize: 12,
            }}
          >
            {t("interested")}
          </Typography>
        )}

        {/* Name Row */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mt={1}
          sx={{ gap: 1 }}
        >
          <Typography variant="body2" color="textSecondary" noWrap>
            {t("shopName")}:
          </Typography>
          <Typography
            variant="body1"
            fontWeight="bold"
            noWrap
            sx={{
              flexGrow: 1,
              textAlign: "end",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
            title={getDisplayName()} // Tooltip for full name
          >
            {getDisplayName()}
          </Typography>
        </Stack>

        {/* Buttons */}
        <Stack
          direction="row"
          spacing={1}
          mt={2}
          gap={"10px"}
          justifyContent="space-between"
        >
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleEdit}
          >
            {t("edit")}
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleDelete}
          >
            {t("delete")}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default ShopCard;
