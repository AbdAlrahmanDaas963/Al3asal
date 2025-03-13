import React from "react";
import { Button, Stack, Typography, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteOffer } from "./offersSlice"; // Create this action in your slice if not done already

const OfferCard = ({ offer }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = () => {
    if (
      window.confirm(`Are you sure you want to delete this offer? ${offer.id}`)
    ) {
      dispatch(deleteOffer(offer.id));
    }
  };

  console.log("offer", offer);

  return (
    <Stack
      sx={{
        width: "250px",
        border: "1px dotted grey",
        padding: "10px",
        borderRadius: "20px",
        backgroundColor: "#121212",
        color: "#fff",
        position: "relative",
      }}
    >
      {/* Product Image */}
      <img
        src={offer.product?.image || "https://via.placeholder.com/150"}
        alt={offer.product?.name}
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
          borderRadius: "16px",
          backgroundColor: "grey",
        }}
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/150";
        }}
      />

      {/* Featured Tag */}
      {offer.is_featured && (
        <Chip
          label="Featured"
          color="primary"
          size="small"
          sx={{ position: "absolute", top: 10, right: 10 }}
        />
      )}

      {/* Product Name */}
      <Stack direction="row" justifyContent="space-between" mt={1}>
        <Typography variant="body2" color="textSecondary">
          Product Name:
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          {offer.product?.name || "N/A"}
        </Typography>
      </Stack>

      {/* Price */}
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2" color="textSecondary">
          Price:
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          ${offer.final_price || "N/A"}
        </Typography>
      </Stack>

      {/* Sale Percentage */}
      {offer.percentage && (
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="textSecondary">
            Profit:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {offer.percentage}%
          </Typography>
        </Stack>
      )}
      {offer.product && (
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="textSecondary">
            Profit:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {offer.product.category.name}
          </Typography>
        </Stack>
      )}

      {/* Action Buttons */}
      <Stack direction="row" spacing={1} mt={1} justifyContent="center">
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() =>
            navigate(`/dashboard/offer/edit/${offer.id}`, { state: { offer } })
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
};

export default OfferCard;
