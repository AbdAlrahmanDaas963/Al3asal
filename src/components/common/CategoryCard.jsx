import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteCategory } from "../../features/Categories/categorySlice";
import { useTranslation } from "react-i18next";

function CategoryCard({ category }) {
  const { t } = useTranslation("categories");
  const { id, name, image, is_featured, is_interested } = category;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (window.confirm(t("deleteConfirmation", { id }))) {
      dispatch(deleteCategory(id));
    }
  };

  const getDisplayName = () => {
    if (typeof name === "string") return name;
    if (name && name.en) return name.en;
    return t("unnamedCategory");
  };

  return (
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

      <Stack direction="row" justifyContent="space-between" mt={1}>
        <Typography variant="body2" color="textSecondary">
          {t("categoryName")}:
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          {getDisplayName()}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} mt={1} justifyContent="space-between">
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() =>
            navigate(`/dashboard/category/edit/${id}`, { state: { category } })
          }
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
  );
}

export default CategoryCard;
