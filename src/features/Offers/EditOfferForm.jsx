import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Stack,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { updateOffer } from "./offersSlice";

const EditOfferForm = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Get offer from navigation state
  const currentOffer = state?.offer;

  // Form state - only editable fields
  const [formData, setFormData] = useState({
    percentage: "",
    poster_image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

  // Initialize form with current offer data
  useEffect(() => {
    if (currentOffer) {
      setFormData({
        percentage: currentOffer.percentage || "",
        poster_image: null, // Keep null to avoid overwriting existing image
      });
      setImagePreview(currentOffer.poster_image || null);
    }
  }, [currentOffer]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      if (file) {
        setFormData((prev) => ({ ...prev, [name]: file }));
        setImagePreview(URL.createObjectURL(file));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validate only editable fields
    if (!formData.percentage) {
      setErrors({ percentage: "Percentage is required" });
      return;
    }

    if (formData.percentage < 0 || formData.percentage > 100) {
      setErrors({ percentage: "Must be between 0-100%" });
      return;
    }

    // Prepare FormData with only editable fields
    const form = new FormData();
    form.append("percentage", formData.percentage);
    if (formData.poster_image) {
      form.append("poster_image", formData.poster_image);
    }

    try {
      await dispatch(
        updateOffer({
          id: currentOffer.id,
          updateData: form,
        })
      ).unwrap();

      navigate("/dashboard/offers", {
        state: { success: "Offer updated successfully" },
      });
    } catch (error) {
      setErrors({ submit: error.message || "Update failed" });
    }
  };

  if (!currentOffer) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error">
          Offer data not found
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            onClick={() => navigate("/dashboard/offers")}
          >
            Back to Offers
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        Edit Offer
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        {/* Read-only Product Info */}
        <TextField
          label="Product"
          value={currentOffer.product?.name || "N/A"}
          fullWidth
          disabled
          sx={{ mb: 2 }}
        />

        {/* Read-only Shop Info */}
        <TextField
          label="Shop"
          value={currentOffer.product?.shop?.name || "N/A"}
          fullWidth
          disabled
          sx={{ mb: 2 }}
        />

        {/* Editable Percentage Field */}
        <TextField
          label="Discount Percentage"
          name="percentage"
          type="number"
          value={formData.percentage}
          onChange={handleChange}
          fullWidth
          required
          error={!!errors.percentage}
          helperText={errors.percentage}
          InputProps={{
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
            inputProps: { min: 0, max: 100, step: 0.01 },
          }}
          sx={{ mb: 2 }}
        />

        {/* Editable Image Upload */}
        <Box mb={2}>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Current Image:
          </Typography>
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Current Offer"
              style={{
                maxWidth: "100%",
                maxHeight: "200px",
                borderRadius: "8px",
                marginBottom: "16px",
              }}
            />
          )}
          <Button variant="contained" component="label">
            {formData.poster_image ? "Change Image" : "Upload New Image"}
            <input
              type="file"
              name="poster_image"
              onChange={handleChange}
              accept="image/*"
              hidden
            />
          </Button>
        </Box>

        {/* Action Buttons */}
        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate("/dashboard/offers")}
          >
            Cancel
          </Button>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Update Offer
          </Button>
        </Stack>

        {errors.submit && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errors.submit}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default EditOfferForm;
