import { Button, Stack, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteShop } from "../../features/Shops/shopSlice";

function ShopCard({ shop }) {
  const { id, name, image, is_interested } = shop;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get display name (handles both string and multilingual object)
  const getDisplayName = () => {
    if (typeof name === "string") return name;
    return name?.en || name?.ar || "Untitled Shop";
  };

  const handleEdit = () => {
    navigate(`/dashboard/shops/edit/${id}`, { state: { shop } });
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
        backgroundColor: "#252525",
        padding: "10px",
        borderRadius: "20px",
        position: "relative",
      }}
    >
      {/* Shop Image */}
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
          e.target.src = "https://via.placeholder.com/300x150?text=Image+Error";
        }}
      />

      {/* Interested Badge */}
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

      {/* Shop Name */}
      <Stack direction="row" justifyContent="space-between" mt={1}>
        <Typography variant="body2" color="textSecondary">
          Shop Name:
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          {getDisplayName()}
        </Typography>
      </Stack>

      {/* Action Buttons */}
      <Stack direction="row" spacing={1} mt={2} justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => navigate(`/dashboard/shops/edit/${id}`)}
          sx={{ flex: 1 }}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={handleDelete}
          sx={{ flex: 1 }}
        >
          Delete
        </Button>
      </Stack>
    </Stack>
  );
}

export default ShopCard;
