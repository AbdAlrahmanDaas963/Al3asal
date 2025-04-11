import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { createProduct } from "./productsSlice";
import { fetchShops } from "../../features/Shops/shopSlice";
import { fetchCategories } from "../../features/Categories/categorySlice";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Container,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  FormHelperText,
  Snackbar,
  Alert,
  Box,
  Grid,
} from "@mui/material";

// Constants
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB (increased from 100KB)
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];
const INITIAL_FORM_STATE = {
  name: { en: "", ar: "" },
  description: { en: "", ar: "" },
  price: "",
  profit_percentage: "",
  is_hot: false,
  image: null,
  shop_id: "",
  category_id: "",
};

// Memoized selectors (unchanged)
const selectShops = createSelector(
  (state) => state.shops,
  (shops) => {
    const shopsData = shops.data?.data || shops.data || shops.shops?.data || [];
    return {
      shops: shopsData,
      shopsLoading: shops.status === "loading",
    };
  }
);

const selectCategories = createSelector(
  (state) => state.categories,
  (categories) => ({
    categories: categories.data || [],
    categoriesLoading: categories.status === "loading",
  })
);

const selectProducts = createSelector(
  (state) => state.products,
  (products) => ({
    productsLoading: products.status === "loading",
    productsError: products.error,
  })
);

const AddProductForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { shops, shopsLoading } = useSelector(selectShops);
  const { categories, categoriesLoading } = useSelector(selectCategories);
  const { productsLoading, productsError } = useSelector(selectProducts);

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch data on mount (unchanged)
  useEffect(() => {
    if (shops.length === 0) {
      dispatch(fetchShops());
    }
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, shops.length, categories.length]);

  // Get filtered categories based on selected shop
  const filteredCategories = useMemo(() => {
    return categories; // Temporarily showing all categories
  }, [formData.shop_id, categories]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    if (name === "image") {
      handleImageChange(files[0]);
      return;
    }

    if (name.includes(".")) {
      const [field, subfield] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [field]: {
          ...(prev[field] || {}),
          [subfield]: value,
        },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name.endsWith("_id") ? String(value) : value,
      ...(name === "shop_id" && { category_id: "" }),
    }));
  };

  const handleImageChange = (file) => {
    if (!file) return;

    // Clear previous errors
    setErrors((prev) => ({ ...prev, image: null }));

    // Validate file type
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: "Only JPG, PNG, or WEBP images are allowed",
      }));
      return;
    }

    // Validate file size
    if (file.size > MAX_IMAGE_SIZE) {
      setErrors((prev) => ({
        ...prev,
        image: `Image must be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`,
      }));
      return;
    }

    // If validation passes
    setFormData((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.ar?.trim())
      newErrors.name_ar = "Arabic name is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.shop_id) newErrors.shop = "Shop is required";
    if (!formData.category_id) newErrors.category = "Category is required";
    if (formData.profit_percentage > 100) {
      newErrors.profit_percentage = "Must be ≤ 100";
    }
    if (!formData.image) newErrors.image = "Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const form = new FormData();
      form.append("name[en]", formData.name?.en || "");
      form.append("name[ar]", formData.name?.ar || "");
      form.append("description[en]", formData.description?.en || "");
      form.append("description[ar]", formData.description?.ar || "");
      form.append("image", formData.image);
      form.append("is_hot", formData.is_hot ? "1" : "0");
      form.append("category_id", formData.category_id);
      form.append("profit_percentage", formData.profit_percentage);
      form.append("price", formData.price);
      form.append("shop_id", formData.shop_id);

      const result = await dispatch(createProduct(form));
      if (result.meta.requestStatus === "fulfilled") {
        handleSuccess();
      }
    } catch (error) {
      console.error("Product submission error:", error);
      setErrors({ submit: error.message || "Failed to add product" });
    }
  };

  const handleSuccess = () => {
    setSnackbarOpen(true);
    setFormData(INITIAL_FORM_STATE);
    setImagePreview(null);
    onSuccess?.();
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h5" gutterBottom>
        Add Product
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          {/* Name Fields */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Name (English)"
              name="name.en"
              value={formData.name.en}
              onChange={handleChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Name (Arabic)"
              name="name.ar"
              value={formData.name.ar}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.name_ar}
              helperText={errors.name_ar}
            />
          </Grid>

          {/* Shop and Category Selection */}
          <Grid item xs={12} md={6}>
            <ShopSelect
              shops={shops}
              loading={shopsLoading}
              value={formData.shop_id}
              onChange={handleChange}
              error={errors.shop}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <CategorySelect
              categories={filteredCategories}
              loading={categoriesLoading}
              disabled={!formData.shop_id}
              value={formData.category_id}
              onChange={handleChange}
              error={errors.category}
            />
          </Grid>

          {/* Price and Profit */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              fullWidth
              error={!!errors.price}
              helperText={errors.price}
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Profit Percentage"
              name="profit_percentage"
              type="number"
              value={formData.profit_percentage}
              onChange={handleChange}
              fullWidth
              error={!!errors.profit_percentage}
              helperText={errors.profit_percentage}
              InputProps={{ inputProps: { min: 0, max: 100, step: 0.01 } }}
            />
          </Grid>

          {/* Descriptions */}
          <Grid item xs={12} md={6}>
            <TextField
              label="Description (English)"
              name="description.en"
              value={formData.description.en}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Description (Arabic)"
              name="description.ar"
              value={formData.description.ar}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
            />
          </Grid>

          {/* Image Upload and Hot Product */}
          <Grid item xs={12} md={6}>
            <ImageUpload
              onChange={handleChange}
              preview={imagePreview}
              error={errors.image}
              maxSize={MAX_IMAGE_SIZE}
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{ display: "flex", alignItems: "center" }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  name="is_hot"
                  checked={formData.is_hot}
                  onChange={handleChange}
                  color="primary"
                />
              }
              label="Mark as Hot Product"
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={productsLoading}
            sx={{ minWidth: 150 }}
          >
            {productsLoading ? <CircularProgress size={24} /> : "Add Product"}
          </Button>
        </Box>

        {productsError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {productsError.message || "Failed to add product"}
          </Alert>
        )}
      </Box>

      <SuccessSnackbar
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
      />
    </Container>
  );
};

// Extracted Components with improvements
const ShopSelect = ({ shops, loading, value, onChange, error }) => (
  <FormControl fullWidth required error={!!error}>
    <InputLabel>Shop</InputLabel>
    <Select
      name="shop_id"
      value={value}
      onChange={onChange}
      label="Shop"
      disabled={loading}
    >
      <MenuItem value="" disabled>
        Select a shop
      </MenuItem>
      {shops.map((shop) => (
        <MenuItem key={shop.id} value={String(shop.id)}>
          {shop.name?.ar || shop.name?.en || shop.name || `Shop ${shop.id}`}
        </MenuItem>
      ))}
    </Select>
    {error && <FormHelperText error>{error}</FormHelperText>}
  </FormControl>
);

const CategorySelect = ({
  categories,
  loading,
  disabled,
  value,
  onChange,
  error,
}) => (
  <FormControl fullWidth required error={!!error} disabled={disabled}>
    <InputLabel>Category</InputLabel>
    <Select
      name="category_id"
      value={value}
      onChange={onChange}
      label="Category"
      disabled={disabled || loading}
    >
      {disabled ? (
        <MenuItem value="">Select a shop first</MenuItem>
      ) : categories.length === 0 ? (
        <MenuItem value="">No categories available</MenuItem>
      ) : (
        categories.map((category) => (
          <MenuItem key={category.id} value={String(category.id)}>
            {category.name?.ar ||
              category.name?.en ||
              category.name ||
              `Category ${category.id}`}
          </MenuItem>
        ))
      )}
    </Select>
    {error && <FormHelperText error>{error}</FormHelperText>}
  </FormControl>
);

const ImageUpload = ({ onChange, preview, error, maxSize }) => (
  <Box>
    <Button variant="contained" component="label" fullWidth>
      Upload Image (max {maxSize / 1024 / 1024}MB)
      <input
        type="file"
        name="image"
        onChange={onChange}
        accept="image/jpeg, image/png, image/jpg, image/webp"
        hidden
      />
    </Button>
    {error && (
      <Typography color="error" variant="body2" sx={{ mt: 1 }}>
        {error}
      </Typography>
    )}
    {preview && (
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <img
          src={preview}
          alt="Preview"
          style={{ maxHeight: 150, maxWidth: "100%", borderRadius: 4 }}
        />
      </Box>
    )}
  </Box>
);

const SuccessSnackbar = ({ open, onClose }) => (
  <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
    <Alert onClose={onClose} severity="success" sx={{ width: "100%" }}>
      Product added successfully!
    </Alert>
  </Snackbar>
);

export default AddProductForm;
