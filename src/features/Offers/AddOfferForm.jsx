import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../Products/productsSlice";
import { createOffer, resetOperationStatus } from "./offersSlice";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
  Snackbar,
  Alert,
  Box,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { styled } from "@mui/material/styles";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const AddOfferForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { data: products, status: productsStatus } = useSelector(
    (state) => state.products
  );
  const { operation } = useSelector((state) => state.offers);

  const [formData, setFormData] = useState({
    percentage: "",
    product_id: "",
    poster_image: null,
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  useEffect(() => {
    if (productsStatus === "idle") {
      setIsLoadingProducts(true);
      dispatch(fetchProducts()).finally(() => setIsLoadingProducts(false));
    }
  }, [dispatch, productsStatus]);

  useEffect(() => {
    return () => {
      dispatch(resetOperationStatus());
    };
  }, [dispatch]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const MAX_FILE_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setValidationErrors({
        ...validationErrors,
        poster_image: "Image size must be less than 2MB",
      });
      e.target.value = "";
      setFormData({ ...formData, poster_image: null });
      setPreviewImage(null);
      return;
    }

    if (!file.type.match("image.*")) {
      setValidationErrors({
        ...validationErrors,
        poster_image: "Please select an image file (JPEG, PNG, etc.)",
      });
      e.target.value = "";
      setFormData({ ...formData, poster_image: null });
      setPreviewImage(null);
      return;
    }

    setValidationErrors({
      ...validationErrors,
      poster_image: undefined,
    });
    setFormData({ ...formData, poster_image: file });

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.percentage) errors.percentage = "Percentage is required";
    if (!formData.product_id) errors.product_id = "Product is required";
    if (!formData.poster_image) errors.poster_image = "Image is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const offerFormData = new FormData();
    offerFormData.append("percentage", formData.percentage);
    offerFormData.append("product_id", formData.product_id);
    offerFormData.append("poster_image", formData.poster_image);

    const result = await dispatch(createOffer(offerFormData));

    if (createOffer.fulfilled.match(result)) {
      setFormData({
        percentage: "",
        product_id: "",
        poster_image: null,
      });
      setPreviewImage(null);
      setValidationErrors({});
      if (onSuccess) onSuccess();
    }
  };

  const handleCloseSnackbar = () => {
    dispatch(resetOperationStatus());
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Create New Offer
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 3 }}
        >
          <FormControl fullWidth error={!!validationErrors.product_id}>
            <InputLabel id="product-select-label">Product</InputLabel>
            <Select
              labelId="product-select-label"
              label="Product"
              value={formData.product_id}
              onChange={(e) =>
                setFormData({ ...formData, product_id: e.target.value })
              }
              disabled={isLoadingProducts}
            >
              {isLoadingProducts ? (
                <MenuItem disabled>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CircularProgress size={20} />
                    <Typography variant="body2">Loading products...</Typography>
                  </Box>
                </MenuItem>
              ) : (
                products.map((product) => (
                  <MenuItem key={product.id} value={product.id}>
                    {product.name.en}
                  </MenuItem>
                ))
              )}
            </Select>
            {validationErrors.product_id && (
              <Typography variant="caption" color="error">
                {validationErrors.product_id}
              </Typography>
            )}
          </FormControl>

          <TextField
            label="Percentage"
            type="number"
            value={formData.percentage}
            onChange={(e) =>
              setFormData({ ...formData, percentage: e.target.value })
            }
            fullWidth
            error={!!validationErrors.percentage}
            helperText={validationErrors.percentage}
            inputProps={{
              min: 1,
              max: 100,
            }}
          />

          <Box>
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUpload />}
              fullWidth
            >
              Upload Poster Image (Max 2MB)
              <VisuallyHiddenInput
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Button>
            {validationErrors.poster_image && (
              <Typography variant="caption" color="error">
                {validationErrors.poster_image}
              </Typography>
            )}
            {previewImage && (
              <Box mt={2} textAlign="center">
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{ maxWidth: "100%", maxHeight: "200px" }}
                />
              </Box>
            )}
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={operation.status === "loading"}
            size="large"
          >
            {operation.status === "loading" ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Create Offer"
            )}
          </Button>
        </Box>

        <Snackbar
          open={
            operation.status === "succeeded" || operation.status === "failed"
          }
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={operation.status === "succeeded" ? "success" : "error"}
            sx={{ width: "100%" }}
          >
            {operation.status === "succeeded"
              ? "Offer created successfully!"
              : operation.error?.message || "Failed to create offer"}
          </Alert>
        </Snackbar>
      </CardContent>
    </Card>
  );
};

export default AddOfferForm;
