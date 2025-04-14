import React from "react";
import { Button, Stack, Typography, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { deleteOffer } from "./offersSlice";

const OfferCard = ({ offer }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Helper function to safely get display text from string or translation object
  const getDisplayText = (text) => {
    if (typeof text === "string") return text;
    if (text && text.en) return text.en; // Default to English
    return "N/A"; // Fallback
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete offer ${offer.id}?`)) {
      dispatch(deleteOffer(offer.id));
    }
  };

  const handleEdit = () => {
    navigate("/dashboard/offers/edit", {
      state: {
        offer: {
          ...offer,
          product_name: offer.product?.name,
          shop_name: offer.product?.shop?.name,
          product_image: offer.product?.image,
          category_name: offer.product?.category?.name,
        },
      },
    });
  };

  return (
    <Stack
      sx={{
        width: "250px",
        backgroundColor: "#252525",
        padding: "10px",
        borderRadius: "20px",
        color: "#fff",
        position: "relative",
      }}
    >
      {/* Product Image */}
      <img
        src={offer.product?.image || "https://via.placeholder.com/150"}
        alt={getDisplayText(offer.product?.name)}
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

      {/* Product Info */}
      <Stack direction="row" justifyContent="space-between" mt={1}>
        <Typography variant="body2" color="textSecondary">
          Product:
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          {getDisplayText(offer.product?.name)}
        </Typography>
      </Stack>

      <Stack direction="row" justifyContent="space-between">
        <Typography variant="body2" color="textSecondary">
          Price:
        </Typography>
        <Typography variant="body1" fontWeight="bold">
          ${offer.final_price || "N/A"}
        </Typography>
      </Stack>

      {offer.percentage && (
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="textSecondary">
            Discount:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {offer.percentage}%
          </Typography>
        </Stack>
      )}

      {/* Category */}
      {offer.product?.category && (
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="textSecondary">
            Category:
          </Typography>
          <Typography variant="body1" fontWeight="bold">
            {getDisplayText(offer.product.category.name)}
          </Typography>
        </Stack>
      )}

      {/* Action Buttons */}
      <Stack direction="row" spacing={1} mt={2}>
        <Button variant="contained" size="small" onClick={handleEdit}>
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
