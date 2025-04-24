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
import { createCategory, fetchCategories } from "./categorySlice";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const AddCategoryForm = () => {
  const { t } = useTranslation("categories");
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

  const {
    shops,
    status: shopsStatus,
    error: shopsError,
  } = useSelector((state) => state.shops);
  const { status: categoryStatus } = useSelector((state) => state.categories);

  useEffect(() => {
    if (shopsStatus === "idle") {
      dispatch(fetchShops());
    }
  }, [dispatch, shopsStatus]);

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

    const MAX_FILE_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setErrorMessage(t("imageSizeError"));
      e.target.value = "";
      setFormData((prev) => ({ ...prev, image: null }));
      setPreview(null);
      return;
    }

    if (!file.type.match("image.*")) {
      setErrorMessage(t("imageTypeError"));
      e.target.value = "";
      setFormData((prev) => ({ ...prev, image: null }));
      setPreview(null);
      return;
    }

    setErrorMessage("");
    setFormData({ ...formData, image: file });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setValidationErrors({});

    // Validate form data
    const errors = {};
    if (!formData.shop_id) errors.shop_id = t("shopRequired");
    if (!formData.name.en)
      errors.name = { ...errors.name, en: t("nameEnRequired") };
    if (!formData.name.ar)
      errors.name = { ...errors.name, ar: t("nameArRequired") };

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    try {
      // Generate a temporary ID for optimistic update
      const tempId = `temp-${Date.now()}`;

      // Create payload with temporary ID
      const payload = {
        ...formData,
        tempId, // Pass tempId to match with server response later
      };

      // 1. Optimistically add to store
      dispatch({
        type: "categories/addTempCategory",
        payload: {
          id: tempId,
          name: formData.name,
          image: formData.image, // This could be a File object
          is_interested: formData.is_interested || false,
          shops: formData.shop_id ? [formData.shop_id] : [],
          isTemp: true,
        },
      });

      // 2. Create category on server
      const newCategory = await dispatch(createCategory(payload)).unwrap();

      // 3. The Redux slice will handle replacing the temp category with the real one
      // (This happens in the createCategory.fulfilled case in your slice)

      // 4. Optional: Force refresh to ensure all data is synced
      dispatch(fetchCategories());

      // 5. Navigate only after everything is complete
      // navigate("/dashboard/category", {
      //   state: { successMessage: t("categoryCreatedSuccess") },
      // });
    } catch (err) {
      // The Redux slice will automatically remove the temp category on error
      // (Handled in createCategory.rejected case in your slice)

      setErrorMessage(
        err.message || err?.response?.data?.message || t("createError")
      );

      if (err?.response?.data?.errors) {
        setValidationErrors(err.response.data.errors);
      }

      // If you need to manually remove the temp category (fallback)
      dispatch({
        type: "categories/removeTempCategory",
        payload: tempId,
      });
    }
  };

  const getShopName = (shop) => {
    return typeof shop.name === "string"
      ? shop.name
      : shop.name?.en || shop.name?.ar || t("unnamedShop");
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
        {t("addCategoryTitle")}
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 2, width: "400px" }}
      >
        {/* English Name */}
        <TextField
          label={t("nameEn")}
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
          label={t("nameAr")}
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
          <InputLabel>{t("shop")}</InputLabel>
          <Select
            label={t("shop")}
            name="shop_id"
            value={formData.shop_id}
            onChange={handleChange}
            disabled={shopsStatus === "loading"}
          >
            {shopsStatus === "loading" ? (
              <MenuItem disabled>{t("loadingShops")}</MenuItem>
            ) : shops?.data?.length > 0 ? (
              shops.data.map((shop) => (
                <MenuItem key={shop.id} value={shop.id}>
                  {getShopName(shop)}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>{t("noShops")}</MenuItem>
            )}
          </Select>
          {validationErrors.shop_id && (
            <FormHelperText>{validationErrors.shop_id}</FormHelperText>
          )}
        </FormControl>

        {/* Image Upload */}
        <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
          {t("uploadImage")}
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
            <Typography variant="body2">{t("imagePreview")}</Typography>
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
          {categoryStatus === "loading" ? t("creating") : t("createCategory")}
        </Button>
      </Box>
    </Box>
  );
};

export default AddCategoryForm;
