import { fetchShops } from "../Shops/shopSlice";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createCategory } from "./categorySlice";
import { useNavigate } from "react-router-dom";

const AddCategoryForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: { en: "", ar: "" },
    image: null,
    is_interested: "1",
    shop_id: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [preview, setPreview] = useState(null);

  // Get shops and category status from Redux
  const {
    shops,
    status: shopsStatus,
    error: shopsError,
  } = useSelector((state) => state.shops);
  const { status: categoryStatus } = useSelector((state) => state.categories);

  // Fetch shops on mount
  useEffect(() => {
    if (shopsStatus === "idle") {
      dispatch(fetchShops());
    }
  }, [dispatch, shopsStatus]);

  // Handle image preview
  useEffect(() => {
    if (formData.image) {
      const objectUrl = URL.createObjectURL(formData.image);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [formData.image]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "en" || name === "ar") {
      setFormData((prev) => ({
        ...prev,
        name: {
          ...prev.name,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (2MB limit)
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage("Image size must be less than 2MB");
      e.target.value = ""; // Clear the file input
      setFormData((prev) => ({ ...prev, image: null }));
      setPreview(null);
      return;
    }

    // Check file type
    if (!file.type.match("image.*")) {
      setErrorMessage("Please select an image file");
      e.target.value = ""; // Clear the file input
      setFormData((prev) => ({ ...prev, image: null }));
      setPreview(null);
      return;
    }

    // If validation passes
    setErrorMessage("");
    setFormData({ ...formData, image: file });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setValidationErrors({});

    // Validation
    const errors = {};
    if (!formData.shop_id) errors.shop_id = "Shop is required";
    if (!formData.name.en)
      errors.name = { ...errors.name, en: "English name is required" };
    if (!formData.name.ar)
      errors.name = { ...errors.name, ar: "Arabic name is required" };

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    dispatch(createCategory(formData))
      .unwrap()
      .then(() => {
        navigate("/dashboard/category");
      })
      .catch((err) => {
        setErrorMessage(
          err.message ||
            err.response?.data?.message ||
            "Failed to create category"
        );
        if (err.response?.data?.errors) {
          setValidationErrors(err.response.data.errors);
        }
      });
  };

  const getShopName = (shop) => {
    return typeof shop.name === "string"
      ? shop.name
      : shop.name?.en || shop.name?.ar || "Untitled Shop";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Add New Category
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 2, width: "400px" }}
      >
        {/* English Name */}
        <TextField
          label="Category Name (English)"
          name="en"
          value={formData.name.en}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!validationErrors.name?.en}
          helperText={validationErrors.name?.en}
        />

        {/* Arabic Name */}
        <TextField
          label="Category Name (Arabic)"
          name="ar"
          value={formData.name.ar}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!validationErrors.name?.ar}
          helperText={validationErrors.name?.ar}
        />

        {/* Shop Selection */}
        <FormControl
          fullWidth
          margin="normal"
          required
          error={!!validationErrors.shop_id}
        >
          <InputLabel>Shop</InputLabel>
          <Select
            label="Shop"
            name="shop_id"
            value={formData.shop_id}
            onChange={handleChange}
            disabled={shopsStatus === "loading"}
          >
            {shopsStatus === "loading" ? (
              <MenuItem disabled>Loading shops...</MenuItem>
            ) : shops?.data?.length > 0 ? (
              shops.data.map((shop) => (
                <MenuItem key={shop.id} value={shop.id}>
                  {getShopName(shop)}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No shops available</MenuItem>
            )}
          </Select>
          {validationErrors.shop_id && (
            <FormHelperText>{validationErrors.shop_id}</FormHelperText>
          )}
        </FormControl>

        {/* Image Upload */}
        <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
          Upload Image (Max 2MB)
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={handleFileChange}
          />
        </Button>

        {/* Image Preview */}
        {preview && (
          <Box mt={2}>
            <Typography variant="body2">Image Preview:</Typography>
            <img
              src={preview}
              alt="Preview"
              style={{
                width: "100%",
                maxHeight: "200px",
                objectFit: "contain",
              }}
            />
          </Box>
        )}

        {/* Error Message */}
        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={categoryStatus === "loading"}
          startIcon={
            categoryStatus === "loading" ? <CircularProgress size={20} /> : null
          }
        >
          {categoryStatus === "loading" ? "Creating..." : "Create Category"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddCategoryForm;
