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
  Backdrop,
} from "@mui/material";
import { useTranslation } from "react-i18next";

// Constants
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];

const EditProductForm = () => {
  const { t } = useTranslation(["productForm", "products"]);
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
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFormLoading, setIsFormLoading] = useState(true);

  // Current product from either location state or Redux
  const currentProduct = state?.product || selectedProduct;

  // Fetch data on mount
  useEffect(() => {
    setIsFormLoading(true);
    if (shopsStatus === "idle") dispatch(fetchShops());
    if (categoriesStatus === "idle") dispatch(fetchCategories());
    if (id && !currentProduct) dispatch(fetchProductById(id));
  }, [dispatch, id, currentProduct, shopsStatus, categoriesStatus]);

  // Initialize form when data is ready
  useEffect(() => {
    if (
      currentProduct &&
      shops.length > 0 &&
      categories.length > 0 &&
      !isInitialized
    ) {
      const initializeForm = () => {
        setIsFormLoading(true);

        // Handle name
        const nameValue =
          typeof currentProduct.name === "string"
            ? { en: currentProduct.name, ar: currentProduct.name }
            : currentProduct.name || { en: "", ar: "" };

        // Handle description
        const descriptionValue =
          typeof currentProduct.description === "string"
            ? { en: currentProduct.description, ar: currentProduct.description }
            : currentProduct.description || { en: "", ar: "" };

        // Find the current shop
        const currentShop = shops.find(
          (shop) => String(shop.id) === String(currentProduct.shop?.id)
        );
        const initialShopId = currentShop ? String(currentShop.id) : "";

        // Find the current category - we need to check both direct category reference
        // and through the shop's categories
        let initialCategoryId = "";
        if (currentProduct.category?.id) {
          const categoryExists = categories.some(
            (category) =>
              String(category.id) === String(currentProduct.category.id)
          );
          if (categoryExists) {
            initialCategoryId = String(currentProduct.category.id);
          }
        }

        setFormData({
          name: nameValue,
          description: descriptionValue,
          price: currentProduct.price?.toString() || "",
          profit_percentage: currentProduct.profit_percentage?.toString() || "",
          is_hot: Boolean(currentProduct.is_hot),
          image: null,
          shop_id: initialShopId,
          category_id: initialCategoryId, // This will now properly set the category
        });

        if (currentProduct.image) {
          setImagePreview(currentProduct.image);
        }

        setIsInitialized(true);
        setIsFormLoading(false);
      };

      initializeForm();
    }
  }, [currentProduct, shops, categories, isInitialized]);

  // Filter categories based on selected shop
  const filteredCategories = useMemo(() => {
    if (!formData.shop_id) return [];

    return categories.filter((category) => {
      // Some categories might have shops array, others might reference shop differently
      if (category.shops) {
        return category.shops.some(
          (shop) => String(shop.id) === String(formData.shop_id)
        );
      }
      // Add additional checks if your category-shop relationship is different
      return true;
    });
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
    if (!formData.name?.ar?.trim()) newErrors.name_ar = t("form.name.arError");
    if (!formData.price) newErrors.price = t("form.price.error");
    if (!formData.shop_id) newErrors.shop = t("form.shop.error");
    if (!formData.category_id) newErrors.category = t("form.category.error");
    if (formData.profit_percentage > 100) {
      newErrors.profit_percentage = t("form.profit.error");
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
    form.append("description[en]", formData.description.en || "");
    form.append("description[ar]", formData.description.ar || "");
    form.append("is_hot", formData.is_hot ? "1" : "0");
    form.append("category_id", formData.category_id);
    form.append("profit_percentage", formData.profit_percentage);
    form.append("price", formData.price);
    form.append("shop_id", formData.shop_id);

    // Only append image if it's a new file
    if (formData.image instanceof File) {
      form.append("image", formData.image);
    }

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
        <Typography sx={{ ml: 2 }}>{t("messages.loading")}</Typography>
      </Container>
    );
  }

  if (!currentProduct && status === "succeeded") {
    return (
      <Container>
        <Alert severity="error">
          {t("messages.notFound")}
          <Button
            onClick={() => navigate("/dashboard/products")}
            sx={{ ml: 2 }}
          >
            {t("messages.back")}
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isFormLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        {t("title")}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Name Fields */}
          <Grid item xs={12} md={6}>
            <TextField
              label={t("form.name.en")}
              name="name.en"
              value={formData.name.en}
              onChange={handleChange}
              fullWidth
              disabled={isFormLoading}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t("form.name.ar")}
              name="name.ar"
              value={formData.name.ar}
              onChange={handleChange}
              fullWidth
              required
              error={!!errors.name_ar}
              helperText={errors.name_ar}
              disabled={isFormLoading}
            />
          </Grid>

          {/* Shop and Category Selection */}
          <Grid item xs={12} md={6}>
            <FormControl
              fullWidth
              required
              error={!!errors.shop}
              disabled={isFormLoading}
            >
              <InputLabel>{t("form.shop.label")}</InputLabel>
              <Select
                name="shop_id"
                value={formData.shop_id}
                onChange={handleChange}
                label={t("form.shop.label")}
                disabled={shopsStatus === "loading" || isFormLoading}
              >
                <MenuItem value="" disabled>
                  {shopsStatus === "loading"
                    ? t("form.shop.loading")
                    : t("form.shop.select")}
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
            <FormControl
              fullWidth
              required
              error={!!errors.category}
              disabled={isFormLoading}
            >
              <InputLabel>{t("form.category.label")}</InputLabel>
              <Select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                label={t("form.category.label")}
                disabled={
                  !formData.shop_id ||
                  categoriesStatus === "loading" ||
                  isFormLoading
                }
              >
                {!formData.shop_id ? (
                  <MenuItem value="" disabled>
                    {t("form.category.selectShop")}
                  </MenuItem>
                ) : filteredCategories.length === 0 ? (
                  <MenuItem value="" disabled>
                    {t("form.category.noCategories")}
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
              label={t("form.price.label")}
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              required
              fullWidth
              error={!!errors.price}
              helperText={errors.price}
              InputProps={{ inputProps: { min: 0 } }}
              disabled={isFormLoading}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t("form.profit.label")}
              name="profit_percentage"
              type="number"
              value={formData.profit_percentage}
              onChange={handleChange}
              fullWidth
              error={!!errors.profit_percentage}
              helperText={errors.profit_percentage}
              InputProps={{ inputProps: { min: 0, max: 100, step: 0.01 } }}
              disabled={isFormLoading}
            />
          </Grid>

          {/* Descriptions */}
          <Grid item xs={12} md={6}>
            <TextField
              label={t("form.description.en")}
              name="description.en"
              value={formData.description.en}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              disabled={isFormLoading}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label={t("form.description.ar")}
              name="description.ar"
              value={formData.description.ar}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              disabled={isFormLoading}
            />
          </Grid>

          {/* Image Upload and Hot Product */}
          <Grid item xs={12} md={6}>
            <Box>
              <Button
                variant="contained"
                component="label"
                fullWidth
                disabled={isFormLoading}
              >
                {imagePreview ? t("form.image.change") : t("form.image.upload")}{" "}
                ({t("form.image.maxSize")})
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  accept="image/jpeg, image/png, image/jpg, image/webp"
                  hidden
                  disabled={isFormLoading}
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
                    alt={t("form.image.preview")}
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
                  disabled={isFormLoading}
                />
              }
              label={t("form.hotProduct")}
            />
          </Grid>
        </Grid>

        <Box
          sx={{ mt: 4, display: "flex", justifyContent: "flex-end", gap: 2 }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate("/dashboard/products")}
            disabled={isFormLoading}
          >
            {t("form.buttons.cancel")}
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={status === "loading" || isFormLoading}
            sx={{ minWidth: 120 }}
          >
            {status === "loading" ? (
              <CircularProgress size={24} />
            ) : (
              t("form.buttons.update")
            )}
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mt: 3 }}>
            {error.message || t("messages.error")}
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
          {t("messages.success")}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default EditProductForm;
