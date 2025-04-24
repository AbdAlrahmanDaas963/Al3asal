import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteCategory } from "../../features/Categories/categorySlice";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { LanguageContext } from "../../contexts/LanguageContext";

function CategoryCard({ category }) {
  const { t } = useTranslation("categories");
  const { language } = useContext(LanguageContext);
  const { id, name, image, is_featured, is_interested } = category;

  const { status, operation } = useSelector((state) => state.categories);

  const isDeleting =
    status === "loading" && operation === "delete" && category.id === id;

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

  // Support multilingual names
  const getDisplayName = () => {
    if (typeof name === "string") return name;
    if (name && name[language]) return name[language];
    return t("unnamedCategory");
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
          src={image}
          style={{
            width: "100%",
            height: "150px",
            objectFit: "cover",
            borderRadius: "16px",
            backgroundColor: "grey",
          }}
          alt={getDisplayName()}
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/150";
          }}
        />

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
            title={getDisplayName()} // Tooltip
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
