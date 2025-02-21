import { Button, Stack, Typography, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteCategory } from "../../features/Categories/categorySlice";

function CategoryCard({ category }) {
  const { id, name, image, is_featured } = category;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (
      window.confirm(`Are you sure you want to delete this category? ${id}`)
    ) {
      dispatch(deleteCategory(id));
    }
  };

  return (
    <Stack
      sx={{
        width: "300px",
        border: "1px dotted grey",
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
        alt={name}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/150";
        }}
      />

      {is_featured ? (
        <Chip
          label="Featured"
          color="primary"
          size="small"
          sx={{ position: "absolute", top: 10, right: 10 }}
        />
      ) : null}

      <Stack direction="row" justifyContent="space-between" mt={1}>
        <Typography variant="body2" color="textSecondary">
          Category Name:
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          {name}
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
