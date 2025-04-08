import { Button, Stack, Typography, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteShop } from "../../features/Shops/shopSlice";

function ProductCard({ item }) {
  const { id, name, image, is_interested } = item;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleEdit = (shop) => {
    navigate(`/dashboard/shops/edit/${shop.id}`, { state: { shop } });
  };
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this shop?")) {
      dispatch(deleteShop(id));
    }
  };

  return (
    <Stack
      sx={{
        width: "300px",
        // border: "1px solid grey",
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
        alt={name}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/150";
        }}
      />

      {/* {is_interested ? (
        <Chip
          label="Interested"
          color="primary"
          size="small"
          sx={{ position: "absolute", top: 10, right: 10 }}
        />
      ) : null} */}

      <Stack direction="row" justifyContent="space-between" mt={1}>
        <Typography variant="body2" color="textSecondary">
          Product Name:
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
            navigate(`/dashboard/shops/edit/${id}`, { state: { item } })
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

export default ProductCard;
