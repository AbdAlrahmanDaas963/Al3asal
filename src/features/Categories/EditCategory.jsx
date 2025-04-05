import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Paper,
  Avatar,
  IconButton,
} from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategoryById,
  updateCategory,
  resetStatus,
} from "./categorySlice";
import CloseIcon from "@mui/icons-material/Close";

const EditCategoryForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { categoryId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const categoryFromState = location.state?.item;
  const { status, error, selectedCategory } = useSelector(
    (state) => state.categories
  );

  const [formData, setFormData] = useState({
    name: { en: "", ar: "" },
    image: null,
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [preview, setPreview] = useState(null);
  const [fileError, setFileError] = useState("");

  // Fetch category data on mount if not present in state
  useEffect(() => {
    if (!categoryFromState && !selectedCategory?.data) {
      dispatch(fetchCategoryById(categoryId));
    }
  }, [dispatch, categoryId, categoryFromState, selectedCategory?.data]);

  // Set form data when category data is available
  useEffect(() => {
    const categoryData = categoryFromState || selectedCategory?.data;
    if (categoryData) {
      setFormData({
        name: {
          en: categoryData.name?.en || "",
          ar: categoryData.name?.ar || "",
        },
        image: categoryData.image || null,
      });
    }
  }, [categoryFromState, selectedCategory]);

  // Reset status and clean up preview URLs
  useEffect(() => {
    dispatch(resetStatus());
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [dispatch, preview]);

  // Handle image preview
  useEffect(() => {
    if (formData.image && typeof formData.image !== "string") {
      const objectUrl = URL.createObjectURL(formData.image);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [formData.image]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name.startsWith("name.")) {
        const lang = name.split(".")[1];
        return {
          ...prev,
          name: { ...prev.name, [lang]: value },
        };
      }
      return { ...prev, [name]: value };
    });

    // Clear validation error when user types
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.match("image.*")) {
      setFileError("Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      // 2MB limit
      setFileError("Image size should be less than 2MB");
      return;
    }

    setFileError("");
    setFormData({ ...formData, image: file });
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setPreview(null);
    setFileError("");
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.en.trim())
      errors["name.en"] = "English name is required";
    if (!formData.name.ar.trim()) errors["name.ar"] = "Arabic name is required";
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isFormUnchanged = () => {
    const originalData = categoryFromState || selectedCategory?.data;
    if (!originalData) return true;

    return (
      formData.name.en === originalData.name?.en &&
      formData.name.ar === originalData.name?.ar &&
      (formData.image === originalData.image ||
        (typeof formData.image === "string" &&
          formData.image === originalData.image))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (isFormUnchanged()) {
      setValidationErrors({ form: "No changes detected" });
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("name[en]", formData.name.en);
    formDataToSend.append("name[ar]", formData.name.ar);
    if (formData.image && typeof formData.image !== "string") {
      formDataToSend.append("image", formData.image);
    }

    dispatch(updateCategory({ id: categoryId, categoryData: formDataToSend }))
      .unwrap()
      .then(() => {
        setTimeout(() => navigate("/dashboard/category"), 1500); // Delay to show success message
      })
      .catch((err) => {
        if (err.response?.data?.errors) {
          setValidationErrors(err.response.data.errors);
        }
      });
  };

  if (status === "loading" && !selectedCategory?.data && !categoryFromState) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="200px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        p: isMobile ? 2 : 4,
        width: "100%",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: isMobile ? 2 : 4,
          width: "100%",
          maxWidth: "600px",
          borderRadius: "12px",
        }}
      >
        <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
          Edit Category
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <TextField
            label="Category Name (English)"
            name="name.en"
            value={formData.name.en}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            error={!!validationErrors["name.en"]}
            helperText={validationErrors["name.en"]}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Category Name (Arabic)"
            name="name.ar"
            value={formData.name.ar}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            error={!!validationErrors["name.ar"]}
            helperText={validationErrors["name.ar"]}
            sx={{ mb: 3 }}
            dir="rtl"
          />

          <Box sx={{ mb: 2 }}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ py: 1.5 }}
            >
              {formData.image ? "Change Image" : "Upload Image"}
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept="image/*"
              />
            </Button>
            {fileError && (
              <Typography
                color="error"
                variant="caption"
                sx={{ mt: 0.5, display: "block" }}
              >
                {fileError}
              </Typography>
            )}
          </Box>

          {(formData.image || preview) && (
            <Box
              sx={{
                position: "relative",
                mb: 3,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                p: 1,
              }}
            >
              <Typography variant="body2" sx={{ mb: 1 }}>
                {typeof formData.image === "string"
                  ? "Current Image"
                  : "New Image Preview"}
              </Typography>
              <IconButton
                onClick={removeImage}
                sx={{
                  position: "absolute",
                  right: 8,
                  top: 8,
                  backgroundColor: "background.paper",
                  "&:hover": { backgroundColor: "action.hover" },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
              <Box
                component="img"
                src={
                  typeof formData.image === "string" ? formData.image : preview
                }
                alt="Category preview"
                sx={{
                  width: "100%",
                  maxHeight: "300px",
                  objectFit: "contain",
                  borderRadius: 1,
                }}
              />
            </Box>
          )}

          {validationErrors.form && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {validationErrors.form}
            </Alert>
          )}

          {status === "succeeded" && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Category updated successfully!
            </Alert>
          )}

          {status === "failed" && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error?.message || "Failed to update category"}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size={isMobile ? "medium" : "large"}
            disabled={status === "loading" || isFormUnchanged()}
            sx={{
              py: isMobile ? 1 : 1.5,
              borderRadius: "8px",
            }}
          >
            {status === "loading" ? (
              <Box display="flex" alignItems="center">
                <CircularProgress size={24} color="inherit" sx={{ mr: 1.5 }} />
                Updating...
              </Box>
            ) : (
              "Update Category"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default EditCategoryForm;
