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

      setFormData({
        name: {
          en: typeof category.name === "object" ? category.name.en : "",
          ar:
            typeof category.name === "object"
              ? category.name.ar
              : category.name || "",
        },
        is_interested: category.is_interested?.toString() || "1",
        shop_ids: category.shops?.map((shop) => shop.id.toString()) || [],
        image: null, // Don't preload existing image to avoid FormData issues
        previewImage: category.image || null, // Store URL for preview only
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
    return typeof shop.name === "string"
      ? shop.name
      : shop.name?.en || shop.name?.ar || "Untitled Shop";
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
      shop_ids: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        image: e.target.files[0],
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Basic validation
    const newErrors = {};
    if (!formData.name.en) newErrors["name.en"] = "English name required";
    if (!formData.name.ar) newErrors["name.ar"] = "Arabic name required";
    if (formData.shop_ids.length === 0)
      newErrors.shop_ids = "At least one shop required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name[en]", formData.name.en);
    formDataToSend.append("name[ar]", formData.name.ar);
    formDataToSend.append("is_interested", formData.is_interested);

    formData.shop_ids.forEach((id) => {
      formDataToSend.append("shop_ids[]", id);
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
          value={formData.name.en}
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
          value={formData.name.ar}
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
            value={formData.shop_ids}
            onChange={handleShopSelection}
            label="Shops *"
            renderValue={(selected) =>
              selected
                .map((id) => {
                  const shop = shops.data.find((s) => s.id.toString() === id);
                  return shop ? getShopName(shop) : "";
                })
                .join(", ")
            }
          >
            {shops.data.map((shop) => (
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
          Upload Image
          <input
            type="file"
            hidden
            onChange={handleFileChange}
            accept="image/*"
          />
        </Button>

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
