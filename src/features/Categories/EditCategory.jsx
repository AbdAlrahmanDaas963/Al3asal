import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryById, updateCategory } from "./categorySlice";
import { fetchShops } from "../Shops/shopSlice";

const EditCategory = () => {
  const { categoryId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedCategory, status } = useSelector((state) => state.categories);
  const { shops, status: shopsStatus } = useSelector((state) => state.shops);

  const [formData, setFormData] = useState({
    name: { en: "", ar: "" },
    is_interested: "1",
    shop_ids: [],
    image: null,
    previewImage: null,
  });

  const [errors, setErrors] = useState({});

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchCategoryById(categoryId));
    if (shopsStatus === "idle") {
      dispatch(fetchShops());
    }
  }, [dispatch, categoryId, shopsStatus]);

  // Initialize form data when category loads
  useEffect(() => {
    if (selectedCategory?.data) {
      const category = selectedCategory.data;
      const shopsArray = Array.isArray(category.shops) ? category.shops : [];

      setFormData({
        name: {
          en: typeof category.name === "object" ? category.name.en : "",
          ar:
            typeof category.name === "object"
              ? category.name.ar
              : category.name || "",
        },
        is_interested: category.is_interested?.toString() || "1",
        shop_ids:
          shopsArray.map((shop) => shop?.id?.toString()).filter(Boolean) || [],
        image: null,
        previewImage: category.image || null,
      });
    }
  }, [selectedCategory]);

  // Handle image preview cleanup
  useEffect(() => {
    if (formData.image instanceof File) {
      const objectUrl = URL.createObjectURL(formData.image);
      setFormData((prev) => ({ ...prev, previewImage: objectUrl }));
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [formData.image]);

  const getShopName = (shop) => {
    if (!shop) return "Untitled Shop";
    if (typeof shop.name === "string") return shop.name;
    return shop.name?.en || shop.name?.ar || "Untitled Shop";
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("name.")) {
      const lang = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        name: { ...prev.name, [lang]: value },
      }));
    } else if (name === "is_interested") {
      setFormData((prev) => ({ ...prev, [name]: checked ? "1" : "0" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleShopSelection = (e) => {
    setFormData((prev) => ({
      ...prev,
      shop_ids: Array.isArray(e.target.value) ? e.target.value : [],
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (2MB limit)
    const MAX_FILE_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setErrors({
        ...errors,
        image: "Image size must be less than 2MB",
      });
      e.target.value = "";
      setFormData((prev) => ({
        ...prev,
        image: null,
        previewImage: prev.previewImage,
      }));
      return;
    }

    // Check file type
    if (!file.type.match("image.*")) {
      setErrors({
        ...errors,
        image: "Please select an image file (JPEG, PNG, etc.)",
      });
      e.target.value = "";
      setFormData((prev) => ({
        ...prev,
        image: null,
        previewImage: prev.previewImage,
      }));
      return;
    }

    setErrors({
      ...errors,
      image: undefined,
    });
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    const newErrors = {};
    if (!formData.name.en?.trim())
      newErrors["name.en"] = "English name required";
    if (!formData.name.ar?.trim())
      newErrors["name.ar"] = "Arabic name required";
    if (!Array.isArray(formData.shop_ids) || formData.shop_ids.length === 0) {
      newErrors.shop_ids = "At least one shop required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name[en]", formData.name.en);
    formDataToSend.append("name[ar]", formData.name.ar);
    formDataToSend.append("is_interested", formData.is_interested);

    formData.shop_ids.forEach((id) => {
      if (id) formDataToSend.append("shop_ids[]", id);
    });

    if (formData.image instanceof File) {
      formDataToSend.append("image", formData.image);
    }

    try {
      await dispatch(
        updateCategory({
          id: categoryId,
          formData: formDataToSend,
        })
      ).unwrap();

      navigate("/dashboard/category");
    } catch (error) {
      console.error("Update error:", error);
      setErrors({
        form:
          error.message ||
          error.response?.data?.message ||
          "Failed to update category",
      });
    }
  };

  if (!selectedCategory?.data || shopsStatus === "loading") {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  // Safely get shops data
  const shopsData = Array.isArray(shops?.data) ? shops.data : [];

  return (
    <Paper sx={{ p: 3, maxWidth: 600, mx: "auto" }}>
      <Typography variant="h5" gutterBottom>
        Edit Category
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        {/* English Name */}
        <TextField
          label="English Name"
          name="name.en"
          value={formData.name.en || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors["name.en"]}
          helperText={errors["name.en"]}
        />

        {/* Arabic Name */}
        <TextField
          label="Arabic Name"
          name="name.ar"
          value={formData.name.ar || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          dir="rtl"
          error={!!errors["name.ar"]}
          helperText={errors["name.ar"]}
        />

        {/* Interested Checkbox */}
        <FormControlLabel
          control={
            <Checkbox
              name="is_interested"
              checked={formData.is_interested === "1"}
              onChange={handleChange}
            />
          }
          label="Is Interested"
        />

        {/* Shops Multi-select */}
        <FormControl fullWidth margin="normal" error={!!errors.shop_ids}>
          <InputLabel>Shops *</InputLabel>
          <Select
            multiple
            name="shop_ids"
            value={Array.isArray(formData.shop_ids) ? formData.shop_ids : []}
            onChange={handleShopSelection}
            label="Shops *"
            renderValue={(selected) =>
              selected
                .map((id) => {
                  const shop = shopsData.find((s) => s?.id?.toString() === id);
                  return shop ? getShopName(shop) : "";
                })
                .filter(Boolean)
                .join(", ")
            }
          >
            {shopsData.map((shop) => (
              <MenuItem key={shop.id} value={shop.id.toString()}>
                {getShopName(shop)}
              </MenuItem>
            ))}
          </Select>
          {errors.shop_ids && (
            <Typography color="error" variant="caption">
              {errors.shop_ids}
            </Typography>
          )}
        </FormControl>

        {/* Image Upload */}
        <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
          Upload Image (Max 2MB)
          <input
            type="file"
            hidden
            onChange={handleFileChange}
            accept="image/*"
          />
        </Button>

        {/* Image Error */}
        {errors.image && (
          <Typography color="error" variant="caption" display="block">
            {errors.image}
          </Typography>
        )}

        {/* Image Preview */}
        {formData.previewImage && (
          <Box mt={2}>
            <Typography variant="body2">Current Image:</Typography>
            <img
              src={formData.previewImage}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "200px",
                marginTop: "8px",
              }}
            />
          </Box>
        )}

        {/* Error Message */}
        {errors.form && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errors.form}
          </Alert>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          disabled={status === "loading"}
          startIcon={
            status === "loading" ? <CircularProgress size={20} /> : null
          }
        >
          {status === "loading" ? "Updating..." : "Update Category"}
        </Button>
      </Box>
    </Paper>
  );
};

export default EditCategory;
