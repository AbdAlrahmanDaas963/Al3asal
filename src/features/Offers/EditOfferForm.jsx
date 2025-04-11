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
  Card,
  CardContent,
  InputAdornment,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { updateOffer, resetOperationStatus } from "./offersSlice";

const EditOfferForm = () => {
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { operation } = useSelector((state) => state.offers);

  // Get offer from navigation state
  const currentOffer = state?.offer;

  // Form state
  const [formData, setFormData] = useState({
    percentage: "",
    poster_image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  // Initialize form with current offer data
  useEffect(() => {
    if (currentOffer) {
      setFormData({
        percentage: currentOffer.percentage || "",
        poster_image: null, // Keep null to avoid overwriting existing image
      });
      setImagePreview(currentOffer.poster_image || null);
    }

    return () => {
      dispatch(resetOperationStatus());
    };
  }, [currentOffer, dispatch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (2MB limit)
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      setValidationErrors({
        ...validationErrors,
        poster_image: "Image size must be less than 2MB",
      });
      e.target.value = ""; // Clear the file input
      setFormData((prev) => ({ ...prev, poster_image: null }));
      setImagePreview(currentOffer?.poster_image || null); // Revert to original image
      return;
    }

    // Check file type
    if (!file.type.match("image.*")) {
      setValidationErrors({
        ...validationErrors,
        poster_image: "Please select an image file (JPEG, PNG, etc.)",
      });
      e.target.value = ""; // Clear the file input
      setFormData((prev) => ({ ...prev, poster_image: null }));
      setImagePreview(currentOffer?.poster_image || null); // Revert to original image
      return;
    }

    // If validation passes
    setValidationErrors({
      ...validationErrors,
      poster_image: undefined, // Clear any previous image errors
    });
    setFormData((prev) => ({ ...prev, poster_image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handlePercentageChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, percentage: value }));
    setValidationErrors((prev) => ({ ...prev, percentage: null }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.percentage) {
      errors.percentage = "Percentage is required";
    } else if (formData.percentage < 0 || formData.percentage > 100) {
      errors.percentage = "Must be between 0-100%";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const form = new FormData();
    form.append("percentage", formData.percentage);
    if (formData.poster_image) {
      form.append("poster_image", formData.poster_image);
    }

    try {
      const result = await dispatch(
        updateOffer({
          id: currentOffer.id,
          formData: form,
        })
      ).unwrap();

      if (updateOffer.fulfilled.match(result)) {
        navigate("/dashboard/offers", {
          state: { success: "Offer updated successfully" },
        });
      }
    } catch (error) {
      setValidationErrors({
        submit: error.message || "Failed to update offer",
      });
    }
  };

  if (!currentOffer) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Offer data not found. Please select an offer from the list.
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/dashboard/offers")}
        >
          Back to Offers
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Edit Offer
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {/* Read-only Product Info Section */}
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Product Information
            </Typography>
            <Stack spacing={2} sx={{ mb: 3 }}>
              <TextField
                label="Product Name"
                value={currentOffer.product?.name || "N/A"}
                fullWidth
                disabled
              />
              <TextField
                label="Shop"
                value={currentOffer.product?.shop?.name || "N/A"}
                fullWidth
                disabled
              />
              <TextField
                label="Original Price"
                value={
                  currentOffer.product?.price
                    ? `$${currentOffer.product.price.toFixed(2)}`
                    : "N/A"
                }
                fullWidth
                disabled
              />
            </Stack>

            {/* Editable Fields Section */}
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              Offer Details
            </Typography>
            <Stack spacing={2} sx={{ mb: 3 }}>
              <TextField
                label="Discount Percentage"
                name="percentage"
                type="number"
                value={formData.percentage}
                onChange={handlePercentageChange}
                fullWidth
                required
                error={!!validationErrors.percentage}
                helperText={validationErrors.percentage}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                  inputProps: { min: 0, max: 100, step: 0.01 },
                }}
              />

              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  Poster Image (Max 2MB)
                </Typography>
                {imagePreview && (
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Current Offer"
                    sx={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      borderRadius: "8px",
                      mb: 2,
                      display: "block",
                    }}
                  />
                )}
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                >
                  {formData.poster_image ? "Change Image" : "Upload New Image"}
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    hidden
                  />
                </Button>
                {validationErrors.poster_image && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {validationErrors.poster_image}
                  </Typography>
                )}
              </Box>
            </Stack>

            {/* Calculated Price Preview */}
            {currentOffer.product?.price && formData.percentage && (
              <Box
                sx={{ mb: 3, p: 2, bgcolor: "action.hover", borderRadius: 1 }}
              >
                <Typography variant="subtitle2">Price Preview</Typography>
                <Typography>
                  Original: ${currentOffer.product.price.toFixed(2)}
                </Typography>
                <Typography>Discount: {formData.percentage}%</Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  New Price: $
                  {(
                    currentOffer.product.price *
                    (1 - formData.percentage / 100)
                  ).toFixed(2)}
                </Typography>
              </Box>
            )}

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate("/dashboard/offers")}
                disabled={operation.status === "loading"}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={operation.status === "loading"}
              >
                {operation.status === "loading" ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Update Offer"
                )}
              </Button>
            </Stack>

            {/* Error Feedback */}
            {validationErrors.submit && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {validationErrors.submit}
              </Alert>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EditOfferForm;
