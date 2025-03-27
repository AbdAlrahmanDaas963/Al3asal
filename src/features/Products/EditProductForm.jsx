import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { createSelector } from "reselect";
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
} from "@mui/material";

// Memoized selectors (same as AddProductForm)
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
    selectedProduct: products.selectedProduct,
  })
);

const MAX_IMAGE_SIZE = 100 * 1024; // 100kB limit
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

const EditProductForm = ({ onSuccess }) => {
  const { id } = useParams();
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Using memoized selectors (same as AddProductForm)
  const { data: shops, status: shopsStatus } = useSelector(selectShops);
  const { data: categories, status: categoriesStatus } =
    useSelector(selectCategories);
  const { status, error, selectedProduct } = useSelector(selectProducts);

  // Current product from either location state or Redux
  const currentProduct = state?.product || selectedProduct;

  // Form state (same structure as AddProductForm)
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

  // Fetch data on mount (same as AddProductForm)
  useEffect(() => {
    if (shopsStatus === "idle") dispatch(fetchShops());
    if (categoriesStatus === "idle") dispatch(fetchCategories());
    if (id && !currentProduct) dispatch(fetchProductById(id));
  }, [dispatch, shopsStatus, categoriesStatus, id, currentProduct]);

  // Initialize form when data is ready
  useEffect(() => {
    if (currentProduct && shops.length > 0 && categories.length > 0) {
      const shopId = currentProduct.shop?.id?.toString() || "";
      const categoryId = currentProduct.category?.id?.toString() || "";

      setFormData({
        name: {
          en: currentProduct.name?.en || "",
          ar: currentProduct.name?.ar || currentProduct.name || "",
        },
        description: {
          en: currentProduct.description?.en || "",
          ar: currentProduct.description?.ar || "",
        },
        price: currentProduct.price?.toString() || "",
        profit_percentage: currentProduct.profit_percentage?.toString() || "",
        is_hot: Boolean(currentProduct.is_hot),
        image: null, // Keep as null to avoid overwriting existing image
        shop_id: shopId,
        category_id: categoryId,
      });
      setImagePreview(currentProduct.image || null);
    }
  }, [currentProduct, shops, categories]);

  // Category filtering (same as AddProductForm)
  const getCategoriesForShop = useMemo(() => {
    if (!formData.shop_id) return []; // Return empty array if no shop selected
    return categories.filter(
      (category) =>
        // For each category, check if it has shops that match the selected shop_id
        category.shops?.some(
          (shop) => String(shop.id) === String(formData.shop_id) // Compare as strings
        ) // <-- This was the missing parenthesis
    );
  }, [formData.shop_id, categories]); // Only recompute when these values change

  // Handle change (same as AddProductForm)
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
        ...(name === "shop_id" && { category_id: "" }), // Reset category when shop changes
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields (same as AddProductForm)
    const newErrors = {};
    if (!formData.name.ar) newErrors.name_ar = "Arabic name is required";
    if (!formData.price) newErrors.price = "Price is required";
    if (!formData.shop_id) newErrors.shop = "Shop is required";
    if (!formData.category_id) newErrors.category = "Category is required";
    if (formData.profit_percentage > 100) {
      newErrors.profit_percentage = "Must be ≤ 100";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Prepare FormData (same as AddProductForm with update endpoint)
    const form = new FormData();
    form.append("name[en]", formData.name.en);
    form.append("name[ar]", formData.name.ar);
    if (formData.image) form.append("image", formData.image);
    form.append("is_hot", formData.is_hot ? "1" : "0");
    form.append("category_id", formData.category_id);
    form.append("profit_percentage", formData.profit_percentage);
    form.append("price", formData.price);
    form.append("shop_id", formData.shop_id);
    if (formData.description.en)
      form.append("description[en]", formData.description.en);
    if (formData.description.ar)
      form.append("description[ar]", formData.description.ar);

    try {
      const result = await dispatch(
        updateProduct({
          productId: id || currentProduct?.id,
          updatedData: form,
        })
      );

      if (result.meta.requestStatus === "fulfilled") {
        setSnackbarOpen(true);
        onSuccess?.();
        navigate("/dashboard/products", { state: { success: true } });
      }
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  if (status === "loading" && !currentProduct) {
    return (
      <Container
        maxWidth="sm"
        sx={{ display: "flex", justifyContent: "center", mt: 4 }}
      >
        <CircularProgress />
      </Container>
    );
  }

  if (!currentProduct && status === "succeeded") {
    return (
      <Container maxWidth="sm">
        <Alert severity="error">Product not found</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>
        Edit Product
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        {/* Name Fields (same as AddProductForm) */}
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

        {/* Shop Selection (same as AddProductForm) */}
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

        {/* Category Selection (same as AddProductForm) */}
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

        {/* Price and Profit (same as AddProductForm) */}
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

        {/* Descriptions (same as AddProductForm) */}
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

        {/* Hot Product Checkbox (same as AddProductForm) */}
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

        {/* Image Upload (same as AddProductForm) */}
        <Box>
          <Button variant="contained" component="label">
            {imagePreview ? "Change Image" : "Upload Image"} (max 100KB)
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
              Updating Product...
            </>
          ) : (
            "Update Product"
          )}
        </Button>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error.message || "Failed to update product"}
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
          Product updated successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditProductForm;
