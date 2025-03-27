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
} from "@mui/material";

// Memoized selectors
const selectShops = createSelector(
  (state) => state.shops,
  (shops) => ({
    data: shops.data?.data || [],
    status: shops.status,
  })
);

const selectCategories = createSelector(
  (state) => state.categories,
  (categories) => ({
    data: categories.data || [],
    status: categories.status,
  })
);

const selectProducts = createSelector(
  (state) => state.products,
  (products) => ({
    status: products.status,
    error: products.error,
  })
);

// Initial form state
const initialFormState = {
  name: { en: "", ar: "" },
  description: { en: "", ar: "" },
  price: "",
  profit_percentage: "",
  is_hot: false,
  image: null,
  shop_id: "",
  category_id: "",
};

const MAX_IMAGE_SIZE = 100 * 1024; // 100kB limit
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const AddProductForm = ({ onSuccess }) => {
  const dispatch = useDispatch();

  // Using memoized selectors
  const { data: shops, status: shopsStatus } = useSelector(selectShops);
  const { data: categories, status: categoriesStatus } =
    useSelector(selectCategories);
  const { status, error } = useSelector(selectProducts);

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    if (shopsStatus === "idle") dispatch(fetchShops());
    if (categoriesStatus === "idle") dispatch(fetchCategories());
  }, [dispatch, shopsStatus, categoriesStatus]);

  // Fixed category filtering logic
  const getCategoriesForShop = useMemo(() => {
    if (!formData.shop_id) return [];
    return categories.filter((category) =>
      category.shops?.some(
        (shop) => String(shop.id) === String(formData.shop_id)
      )
    );
  }, [formData.shop_id, categories]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (name === "image") {
      const file = files[0];
      if (!file) return;

      // Validate image
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: "Only JPG/PNG images allowed",
        }));
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        setErrors((prev) => ({ ...prev, image: "Image must be <100KB" }));
        return;
      }

      setErrors((prev) => ({ ...prev, image: "" }));
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    } else if (name.includes(".")) {
      const [field, subfield] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [field]: { ...prev[field], [subfield]: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name.endsWith("_id") ? String(value) : value,
        ...(name === "shop_id" && { category_id: "" }), // Reset category on shop change
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const newErrors = {};
    if (!formData.name.ar) newErrors.name_ar = "Arabic name is required";
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

    // Prepare FormData
    const form = new FormData();
    form.append("name[en]", formData.name.en);
    form.append("name[ar]", formData.name.ar);
    form.append("image", formData.image);
    form.append("is_hot", formData.is_hot ? "1" : "0");
    form.append("category_id", formData.category_id);
    form.append("profit_percentage", formData.profit_percentage);
    form.append("price", formData.price);
    if (formData.description.en)
      form.append("description[en]", formData.description.en);
    if (formData.description.ar)
      form.append("description[ar]", formData.description.ar);
    form.append("shop_id", formData.shop_id);

    try {
      const result = await dispatch(createProduct(form));
      if (result.meta.requestStatus === "fulfilled") {
        setSnackbarOpen(true);
        setFormData(initialFormState);
        setImagePreview(null);
        onSuccess?.();
      }
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>
        Add Product
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        {/* Name Fields */}
        <TextField
          label="Name (English)"
          name="name.en"
          value={formData.name.en}
          onChange={handleChange}
          fullWidth
        />
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

        {/* Shop Selection */}
        <FormControl fullWidth required error={!!errors.shop}>
          <InputLabel id="shop-select-label">Shop</InputLabel>
          <Select
            labelId="shop-select-label"
            name="shop_id"
            value={formData.shop_id}
            onChange={handleChange}
            label="Shop"
            disabled={shopsStatus === "loading"}
          >
            <MenuItem value="" disabled>
              Select a shop
            </MenuItem>
            {shops.map((shop) => (
              <MenuItem key={shop.id} value={String(shop.id)}>
                {shop.name}
              </MenuItem>
            ))}
          </Select>
          {errors.shop && <FormHelperText error>{errors.shop}</FormHelperText>}
        </FormControl>

        {/* Category Selection */}
        <FormControl fullWidth required error={!!errors.category}>
          <InputLabel id="category-select-label">Category</InputLabel>
          <Select
            labelId="category-select-label"
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            label="Category"
            disabled={!formData.shop_id || categoriesStatus === "loading"}
          >
            {!formData.shop_id ? (
              <MenuItem disabled value="">
                Select a shop first
              </MenuItem>
            ) : getCategoriesForShop.length === 0 ? (
              <MenuItem disabled value="">
                No categories available for this shop
              </MenuItem>
            ) : (
              getCategoriesForShop.map((category) => (
                <MenuItem key={category.id} value={String(category.id)}>
                  {category.name.ar || category.name.en || category.name}
                </MenuItem>
              ))
            )}
          </Select>
          {errors.category && (
            <FormHelperText error>{errors.category}</FormHelperText>
          )}
        </FormControl>

        {/* Price and Profit Percentage */}
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

        {/* Descriptions */}
        <TextField
          label="Description (English)"
          name="description.en"
          value={formData.description.en}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
        />
        <TextField
          label="Description (Arabic)"
          name="description.ar"
          value={formData.description.ar}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
        />

        {/* Hot Product Checkbox */}
        <FormControlLabel
          control={
            <Checkbox
              name="is_hot"
              checked={formData.is_hot}
              onChange={handleChange}
            />
          }
          label="Hot Product"
        />

        {/* Image Upload */}
        <Box>
          <Button variant="contained" component="label">
            Upload Image (max 100KB)
            <input
              type="file"
              name="image"
              onChange={handleChange}
              accept="image/jpeg, image/png, image/jpg"
              hidden
            />
          </Button>
          {errors.image && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {errors.image}
            </Typography>
          )}
          {imagePreview && (
            <Box sx={{ mt: 2 }}>
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "200px",
                  borderRadius: "4px",
                }}
              />
            </Box>
          )}
        </Box>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={status === "loading"}
          sx={{ mt: 2 }}
        >
          {status === "loading" ? (
            <>
              <CircularProgress size={24} sx={{ mr: 1 }} />
              Adding Product...
            </>
          ) : (
            "Add Product"
          )}
        </Button>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error.message || "Failed to add product"}
          </Alert>
        )}
      </Box>

      {/* Success Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Product added successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddProductForm;
