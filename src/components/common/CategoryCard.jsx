import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  Skeleton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory } from "../../features/Categories/categorySlice";
import { useTranslation } from "react-i18next";
import { useContext, useState } from "react";
import { LanguageContext } from "../../contexts/LanguageContext";

function CategoryCard({ category, isLoading }) {
  const { t } = useTranslation("categories");
  const { language } = useContext(LanguageContext);
  const { id, name, image, is_featured, is_interested } = category || {};
  const [imageError, setImageError] = useState(false);
  const [currentImage, setCurrentImage] = useState(image);

  const { status, operation } = useSelector((state) => state.categories);

  const isDeleting =
    status === "loading" &&
    operation === "delete" &&
    category &&
    category.id === id;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    if (window.confirm(t("deleteConfirmation", { id }))) {
      try {
        await dispatch(deleteCategory(id)).unwrap();
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  // Support multilingual names with better fallbacks
  const getDisplayName = () => {
    if (isLoading) return t("loading");
    if (!name) return t("unnamedCategory");
    if (typeof name === "string") return name;
    if (name && name[language]) return name[language];
    return (name && (name.en || name.ar)) || t("unnamedCategory");
  };

  // Handle image loading and errors
  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      setCurrentImage("/images/default-category.png");
    }
  };

  if (isLoading) {
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
          <Skeleton
            variant="rounded"
            width="100%"
            height={150}
            sx={{ borderRadius: "16px" }}
          />
          <Stack mt={1} sx={{ gap: 1 }}>
            <Skeleton width="60%" height={24} />
            <Skeleton width="80%" height={20} />
          </Stack>
          <Stack direction="row" spacing={1} mt={2}>
            <Skeleton width="100%" height={36} />
            <Skeleton width="100%" height={36} />
          </Stack>
        </Stack>
      </Box>
    );
  }

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
        {currentImage ? (
          <img
            src={currentImage}
            style={{
              width: "100%",
              height: "150px",
              objectFit: "cover",
              borderRadius: "16px",
              backgroundColor: "grey",
            }}
            alt={getDisplayName()}
            onError={handleImageError}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "150px",
              backgroundColor: "grey",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="body2">{t("noImageAvailable")}</Typography>
          </Box>
        )}

        {is_interested && (
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
            {t("categoryName")}:
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
            title={getDisplayName()}
          >
            {getDisplayName()}
          </Typography>
        </Stack>

        {/* Buttons */}
        <Stack
          direction="row"
          spacing={1}
          mt={1}
          justifyContent="space-between"
        >
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() =>
              navigate(`/dashboard/category/edit/${id}`, {
                state: { category },
              })
            }
          >
            {t("edit")}
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={handleDelete}
            disabled={isDeleting}
            startIcon={
              isDeleting ? <CircularProgress size={16} color="inherit" /> : null
            }
          >
            {isDeleting ? t("deleting") : t("delete")}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}

export default CategoryCard;
