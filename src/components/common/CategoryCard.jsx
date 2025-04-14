import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteCategory } from "../../features/Categories/categorySlice";

function CategoryCard({ category }) {
  const { id, name, image, is_featured, is_interested } = category;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (
      window.confirm(`Are you sure you want to delete this category? ${id}`)
    ) {
      dispatch(deleteCategory(id));
    }
  };

  // Safely get the display name (handles both string and {en, ar} object cases)
  const getDisplayName = () => {
    if (typeof name === "string") return name;
    if (name && name.en) return name.en; // Default to English
    return "Unnamed Category"; // Fallback
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
          Interested
        </Typography>
      )}

      <Stack direction="row" justifyContent="space-between" mt={1}>
        <Typography variant="body2" color="textSecondary">
          Category Name:
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          {getDisplayName()}
        </Typography>
      </Stack>

      <Stack direction="row" spacing={1} mt={1} justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() =>
            navigate(`/dashboard/category/edit/${id}`, { state: { category } })
          }
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Stack>
    </Stack>
  );
}

export default CategoryCard;
