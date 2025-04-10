import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { updateProduct, fetchProductById } from "./productsSlice";
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
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB (more realistic limit)
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const EditProductForm = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const { data: shops = [], status: shopsStatus } = useSelector(
    (state) => state.shops
  );
  const { data: categories = [], status: categoriesStatus } = useSelector(
    (state) => state.categories
  );
  const { status, error, selectedProduct } = useSelector(
    (state) => state.products
  );

  // Local state
  const [formData, setFormData] = useState({
    name: { en: "", ar: "" },
    description: { en: "", ar: "" },
    price: "",
    profit_percentage: "",
    is_hot: false,
    image: null,
    shop_id: "",
    category_id: "",
  });
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Current product from either location state or Redux
  const currentProduct = state?.product || selectedProduct;

  // Fetch data on mount
  useEffect(() => {
    if (shopsStatus === "idle") dispatch(fetchShops());
    if (categoriesStatus === "idle") dispatch(fetchCategories());
    if (id && !currentProduct) dispatch(fetchProductById(id));
  }, [dispatch, id, currentProduct, shopsStatus, categoriesStatus]);

  // Initialize form when data is ready
  useEffect(() => {
    if (currentProduct) {
      const initializeForm = () => {
        const nameValue =
          typeof currentProduct.name === "string"
            ? { en: "", ar: currentProduct.name }
            : currentProduct.name || { en: "", ar: "" };

        const descriptionValue =
          typeof currentProduct.description === "string"
            ? { en: "", ar: currentProduct.description }
            : currentProduct.description || { en: "", ar: "" };

        setFormData({
          name: nameValue,
          description: descriptionValue,
          price: currentProduct.price?.toString() || "",
          profit_percentage: currentProduct.profit_percentage?.toString() || "",
          is_hot: Boolean(currentProduct.is_hot),
          image: null,
          shop_id: currentProduct.shop?.id?.toString() || "",
          category_id: currentProduct.category?.id?.toString() || "",
        });

        if (currentProduct.image) {
          setImagePreview(currentProduct.image);
        }
      };

      // Wait for shops and categories if needed
      if (shops.length > 0 && categories.length > 0) {
        initializeForm();
      } else {
        const timer = setTimeout(initializeForm, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [currentProduct, shops, categories]);

  // Filter categories based on selected shop
  const filteredCategories = useMemo(() => {
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
      return;
    }

    if (name === "image") {
      const file = files[0];
      if (!file) return;

      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          image: "Only JPG/PNG images allowed",
        }));
        return;
      }
      if (file.size > MAX_IMAGE_SIZE) {
        setErrors((prev) => ({ ...prev, image: "Image must be <2MB" }));
        return;
      }

      setErrors((prev) => ({ ...prev, image: "" }));
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
      return;
    }

    if (name.includes(".")) {
      const [field, subfield] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [field]: { ...(prev[field] || {}), [subfield]: value },
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: name.endsWith("_id") ? String(value) : value,
      ...(name === "shop_id" && { category_id: "" }), // Reset category on shop change
    }));
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const form = new FormData();

    // Append all fields consistently
    form.append("name[en]", formData.name.en || "");
    form.append("name[ar]", formData.name.ar || "");

    // Only append image if it's a new file
    if (formData.image instanceof File) {
      form.append("image", formData.image);
    }

    form.append("is_hot", formData.is_hot ? "1" : "0");
    form.append("category_id", formData.category_id);
    form.append("profit_percentage", formData.profit_percentage);
    form.append("price", formData.price);

    // Append descriptions
    form.append("description[en]", formData.description.en || "");
    form.append("description[ar]", formData.description.ar || "");

    try {
      const result = await dispatch(
        updateProduct({
          productId: id || currentProduct?.id,
          updatedData: form,
        })
      ).unwrap();

      setSnackbarOpen(true);
      setTimeout(() => navigate("/dashboard/products"), 1500);
    } catch (error) {
      // Handle validation errors from server
      if (error.errors) {
        const serverErrors = {};
        Object.entries(error.errors).forEach(([field, messages]) => {
          serverErrors[field] = Array.isArray(messages)
            ? messages.join(", ")
            : messages;
        });
        setErrors(serverErrors);
      } else {
        setErrors({ submit: error.message || "Failed to update product" });
      }
    }
  };

  if (status === "loading" && !currentProduct) {
    return (
      <Container sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!currentProduct && status === "succeeded") {
    return (
      <Container>
        <Alert severity="error">
          Product not found
          <Button
            onClick={() => navigate("/dashboard/products")}
            sx={{ ml: 2 }}
          >
            Back to Products
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Edit Product
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
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
            <FormControl fullWidth required error={!!errors.shop}>
              <InputLabel>Shop</InputLabel>
              <Select
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
                    {shop.name?.ar || shop.name?.en || shop.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.shop && (
                <FormHelperText error>{errors.shop}</FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required error={!!errors.category}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                label="Category"
                disabled={!formData.shop_id || categoriesStatus === "loading"}
              >
                {!formData.shop_id ? (
                  <MenuItem value="" disabled>
                    Select a shop first
                  </MenuItem>
                ) : filteredCategories.length === 0 ? (
                  <MenuItem value="" disabled>
                    No categories available
                  </MenuItem>
                ) : (
                  filteredCategories.map((category) => (
                    <MenuItem key={category.id} value={String(category.id)}>
                      {category.name?.ar || category.name?.en || category.name}
                    </MenuItem>
                  ))
                )}
              </Select>
              {errors.category && (
                <FormHelperText error>{errors.category}</FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Price and Profit Percentage */}
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
            <Box>
              <Button variant="contained" component="label" fullWidth>
                {imagePreview ? "Change Image" : "Upload Image"} (max 2MB)
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
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      maxHeight: 200,
                      maxWidth: "100%",
                      borderRadius: 4,
                    }}
                  />
                </Box>
              )}
            </Box>
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

        <Box
          sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate("/dashboard/products")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={status === "loading"}
            sx={{ minWidth: 120 }}
          >
            {status === "loading" ? (
              <CircularProgress size={24} />
            ) : (
              "Update Product"
            )}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error.message || "Failed to update product"}
          </Alert>
        )}
      </Box>

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
          Product updated successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditProductForm;
