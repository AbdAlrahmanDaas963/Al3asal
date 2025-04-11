import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchShopById, updateShop, resetStatus } from "./shopSlice";

const EditShopForm = () => {
  const { shopId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const shopFromState = location.state?.item;
  const { status, error, selectedShop } = useSelector((state) => state.shops);

  const [formData, setFormData] = useState({
    name: { en: "", ar: "" },
    is_interested: 1,
    image: null,
    previewImage: null,
  });

  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    dispatch(fetchShopById(shopId));
    return () => dispatch(resetStatus());
  }, [shopId, dispatch]);

  useEffect(() => {
    if (selectedShop) {
      setFormData({
        name: {
          en: selectedShop.name?.en || "",
          ar: selectedShop.name?.ar || "",
        },
        is_interested: selectedShop.is_interested || 1,
        image: null,
        previewImage: selectedShop.image || null,
      });
    }
  }, [selectedShop]);

  useEffect(() => {
    if (formData.image && typeof formData.image !== "string") {
      const objectUrl = URL.createObjectURL(formData.image);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [formData.image]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("name.")) {
      const [_, lang] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        name: {
          ...prev.name,
          [lang]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: name === "is_interested" ? parseInt(value) : value,
      }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setFileName(file.name);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.ar?.trim()) errors.name_ar = "Arabic name is required";
    if (!formData.name.en?.trim()) errors.name_en = "English name is required";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const result = await dispatch(
        updateShop({
          shop_id: shopId,
          formData,
        })
      );

      if (updateShop.fulfilled.match(result)) {
        navigate("/dashboard/shops"); // Immediately navigate back on success
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom align="center">
        Edit Shop
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        {/* Arabic Name */}
        <TextField
          label="Shop Name (Arabic)"
          name="name.ar"
          value={formData.name.ar || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!validationErrors.name_ar}
          helperText={validationErrors.name_ar}
        />

        {/* English Name */}
        <TextField
          label="Shop Name (English)"
          name="name.en"
          value={formData.name.en || ""}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!validationErrors.name_en}
          helperText={validationErrors.name_en}
        />

        <TextField
          select
          label="Is Interested"
          name="is_interested"
          value={formData.is_interested}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        >
          <MenuItem value={1}>Yes</MenuItem>
          <MenuItem value={0}>No</MenuItem>
        </TextField>

        <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
          {fileName || "Upload New Image (max 2MB)"}
          <input
            type="file"
            hidden
            onChange={handleFileChange}
            accept="image/*"
          />
        </Button>

        {(formData.previewImage || preview) && (
          <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom>
              {preview ? "New Preview" : "Current Image"}
            </Typography>
            <img
              src={preview || formData.previewImage}
              alt="Shop preview"
              style={{
                maxWidth: "100%",
                maxHeight: 300,
                borderRadius: 4,
              }}
            />
          </Box>
        )}

        <Box display="flex" gap={2} mt={3}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate("/dashboard/shops")}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={status === "loading"}
            startIcon={
              status === "loading" ? <CircularProgress size={20} /> : null
            }
          >
            {status === "loading" ? "Updating..." : "Update Shop"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EditShopForm;
