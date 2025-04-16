import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { resetStatus, createShop } from "./shopSlice";

// Constants
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/webp",
];

const AddShopForm = () => {
  const [formData, setFormData] = useState({
    name: {
      en: "",
      ar: "",
    },
    is_interested: 1,
    image: null,
  });
  const [localStatus, setLocalStatus] = useState("idle");
  const [fileName, setFileName] = useState("");
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status: reduxStatus, error } = useSelector((state) => state.shops);

  useEffect(() => {
    // Reset status when component mounts
    dispatch(resetStatus());
    setLocalStatus("idle");

    return () => {
      // Cleanup on unmount
      dispatch(resetStatus());
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [dispatch]);

  useEffect(() => {
    // Only update local status if redux status changes to something meaningful
    if (reduxStatus !== "idle") {
      setLocalStatus(reduxStatus);

      // Redirect on success
      if (reduxStatus === "succeeded") {
        const timer = setTimeout(() => {
          navigate("/dashboard/shops");
        }, 1500);

        return () => clearTimeout(timer);
      }
    }
  }, [reduxStatus, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Clear errors when field changes
    if (name.startsWith("name.")) {
      setErrors((prev) => ({ ...prev, [name.split(".")[1]]: undefined }));
    } else {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }

    // Handle nested name fields
    if (name.startsWith("name.")) {
      const [parent, lang] = name.split(".");
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
    if (!file) return;

    setErrors((prev) => ({ ...prev, image: undefined }));

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        image: "Only JPG, PNG or WEBP images allowed",
      }));
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setErrors((prev) => ({
        ...prev,
        image: `Image must be less than ${MAX_IMAGE_SIZE / 1024 / 1024}MB`,
      }));
      return;
    }

    // Clean up previous preview if exists
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setFormData((prev) => ({ ...prev, image: file }));
    setFileName(file.name);
    setImagePreview(URL.createObjectURL(file));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.ar.trim()) newErrors.ar = "Arabic name is required";
    if (!formData.name.en.trim()) newErrors.en = "English name is required";
    if (!formData.image) newErrors.image = "Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setLocalStatus("loading");

    try {
      await dispatch(createShop(formData));
    } catch (err) {
      console.error("Failed to create shop:", err);
      setLocalStatus("failed");
    }
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
        Add New Shop
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 2, width: "400px" }}
      >
        <TextField
          label="Shop Name (Arabic)"
          name="name.ar"
          value={formData.name.ar}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.ar}
          helperText={errors.ar}
        />
        <TextField
          label="Shop Name (English)"
          name="name.en"
          value={formData.name.en}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!errors.en}
          helperText={errors.en}
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

        {errors.image && (
          <Typography
            color="error"
            variant="caption"
            display="block"
            sx={{ mt: 1 }}
          >
            {errors.image}
          </Typography>
        )}
        {imagePreview && (
          <Box mt={2} textAlign="center">
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "200px",
                objectFit: "contain",
              }}
            />
          </Box>
        )}

        {localStatus === "failed" && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error || "Failed to add shop"}
          </Alert>
        )}

        <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
          {fileName || "Upload Image (max 2MB)"}
          <input
            type="file"
            hidden
            onChange={handleFileChange}
            accept="image/jpeg, image/png, image/jpg, image/webp"
          />
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={localStatus === "loading"}
          startIcon={
            localStatus === "loading" ? <CircularProgress size={20} /> : null
          }
        >
          {localStatus === "loading" ? "Adding Shop..." : "Add Shop"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddShopForm;
