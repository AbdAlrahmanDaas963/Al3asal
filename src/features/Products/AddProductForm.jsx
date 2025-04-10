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
const MAX_IMAGE_SIZE = 100 * 1024; // 100KB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const INITIAL_FORM_STATE = {
  name: { en: "", ar: "" }, // Ensure name is always an object
  description: { en: "", ar: "" }, // Ensure description is always an object
  price: "",
  profit_percentage: "",
  is_hot: false,
  image: null,
  shop_id: "",
  category_id: "",
};

// Memoized selectors
const selectShops = createSelector(
  (state) => state.shops,
  (shops) => {
    // Try these different paths to find where your shops actually are
    const shopsData = shops.data?.data || shops.data || shops.shops?.data || [];
    console.log("Processed shops data:", shopsData);
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

  // Fetch data on mount
  useEffect(() => {
    console.log("Checking if we need to fetch data...");
    console.log("Current shops:", shops);
    console.log("Current categories:", categories);

    // Always try to fetch shops if array is empty
    if (shops.length === 0) {
      console.log("Fetching shops...");
      dispatch(fetchShops());
    }

    // Only fetch categories if they're empty
    if (categories.length === 0) {
      console.log("Fetching categories...");
      dispatch(fetchCategories());
    }
  }, [dispatch, shops.length, categories.length]);

  // Get filtered categories based on selected shop
  const filteredCategories = useMemo(() => {
    console.log("ALL CATEGORIES (unfiltered):", categories);

    // For debugging - show all categories regardless of shop
    return categories;

    /* Original filtering logic - enable after shops work
    if (!formData.shop_id) return [];
    return categories.filter((category) => 
      category.shops?.some(shop => String(shop.id) === String(formData.shop_id))
    );
    */
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

    // Safely handle nested fields
    if (name.includes(".")) {
      const [field, subfield] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [field]: {
          ...(prev[field] || {}), // Fallback to empty object if field is undefined
          [subfield]: value,
        },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name.endsWith("_id") ? String(value) : value,
      ...(name === "shop_id" && { category_id: "" }), // Reset category on shop change
    }));
  };

  const handleImageChange = (file) => {
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: "Only JPG/PNG images allowed" }));
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setErrors((prev) => ({ ...prev, image: "Image must be <100KB" }));
      return;
    }

    setErrors((prev) => ({ ...prev, image: "" }));
    setFormData((prev) => ({ ...prev, image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handleNestedFieldChange = (fieldPath, value) => {
    const [field, subfield] = fieldPath.split(".");
    setFormData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [subfield]: value },
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.ar) newErrors.name_ar = "Arabic name is required";
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

    // Validate required fields with safe checks
    const newErrors = {};
    if (!formData.name?.ar) newErrors.name_ar = "Arabic name is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.shop_id) newErrors.shop = "Shop is required";
    if (!formData.category_id) newErrors.category = "Category is required";
    if (formData.profit_percentage > 100) {
      newErrors.profit_percentage = "Must be ≤ 100";
    }
    if (!formData.image) {
      newErrors.image = "Image is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      // Safely prepare FormData with fallbacks
      const form = new FormData();

      // Handle name with fallbacks
      form.append("name[en]", formData.name?.en || "");
      form.append("name[ar]", formData.name?.ar || "");

      // Handle description with fallbacks
      form.append("description[en]", formData.description?.en || "");
      form.append("description[ar]", formData.description?.ar || "");

      // Append other required fields
      form.append("image", formData.image);
      form.append("is_hot", formData.is_hot ? "1" : "0");
      form.append("category_id", formData.category_id);
      form.append("profit_percentage", formData.profit_percentage);
      form.append("price", formData.price);
      form.append("shop_id", formData.shop_id);

      // Debug: Log formData before submission
      console.log("Submitting product with data:", {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        profit_percentage: formData.profit_percentage,
        is_hot: formData.is_hot,
        shop_id: formData.shop_id,
        category_id: formData.category_id,
        image: formData.image ? formData.image.name : "No image",
      });

      const result = await dispatch(createProduct(form));
      if (result.meta.requestStatus === "fulfilled") {
        setSnackbarOpen(true);
        setFormData(INITIAL_FORM_STATE);
        setImagePreview(null);
        onSuccess?.();
      }
    } catch (error) {
      console.error("Product submission error:", error);
      setErrors({ submit: error.message });
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

// Extracted Components
const ShopSelect = ({ shops, loading, value, onChange, error }) => {
  console.log("Rendering ShopSelect with shops:", shops);
  return (
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
        {shops.map((shop) => {
          console.log("Shop item:", shop);
          return (
            <MenuItem key={shop.id} value={String(shop.id)}>
              {shop.name.ar || shop.name.en || shop.name}
            </MenuItem>
          );
        })}
      </Select>
      {error && <FormHelperText error>{error}</FormHelperText>}
    </FormControl>
  );
};

const CategorySelect = ({
  categories,
  loading,
  disabled,
  value,
  onChange,
  error,
}) => {
  console.log("Rendering CategorySelect with categories:", categories);
  return (
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
          categories.map((category) => {
            console.log("Category item:", category);
            return (
              <MenuItem key={category.id} value={String(category.id)}>
                {category.name.ar || category.name.en || category.name}
              </MenuItem>
            );
          })
        )}
      </Select>
      {error && <FormHelperText error>{error}</FormHelperText>}
    </FormControl>
  );
};

const ImageUpload = ({ onChange, preview, error }) => (
  <Box>
    <Button variant="contained" component="label" fullWidth>
      Upload Image (max 100KB)
      <input
        type="file"
        name="image"
        onChange={onChange}
        accept="image/jpeg, image/png, image/jpg"
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
          style={{ maxHeight: 150, borderRadius: 4 }}
        />
      </Box>
    )}
  </Box>
);

const SuccessSnackbar = ({ open, onClose }) => (
  <Snackbar open={open} autoHideDuration={6000} onClose={onClose}>
    <Alert onClose={onClose} severity="success">
      Product added successfully!
    </Alert>
  </Snackbar>
);

export default AddProductForm;
