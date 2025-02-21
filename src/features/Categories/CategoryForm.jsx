import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createCategory,
  updateCategory,
  fetchCategoryById,
} from "./categorySlice";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  MenuItem,
} from "@mui/material";

const CategoryForm = ({ isEdit = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const location = useLocation();
  const { status, error } = useSelector(
    (state) => state.categories || { status: "idle", error: null }
  );

  const [formData, setFormData] = useState({
    name_ar: "",
    name_en: "",
    is_active: "1",
    is_interested: "1",
    shop_id: "",
    image: null,
  });

  // Load category data when editing
  useEffect(() => {
    if (isEdit && categoryId) {
      dispatch(fetchCategoryById(categoryId)).then((response) => {
        if (response.payload) {
          setFormData({
            name_ar: response.payload.name?.ar || "",
            name_en: response.payload.name?.en || "",
            is_active: response.payload.is_active ? "1" : "0",
            is_interested: response.payload.is_interested ? "1" : "0",
            shop_id: response.payload.shop_id || "",
            image: null,
          });
        }
      });
    }
  }, [dispatch, isEdit, categoryId]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file upload
  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("name[ar]", formData.name_ar);
    formDataToSend.append("name[en]", formData.name_en);
    formDataToSend.append("is_active", formData.is_active);
    formDataToSend.append("is_interested", formData.is_interested);
    formDataToSend.append("shop_id", formData.shop_id);

    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    if (isEdit) {
      dispatch(
        updateCategory({ id: categoryId, categoryData: formDataToSend })
      ).then(() => {
        navigate("/categories"); // Redirect after update
      });
    } else {
      dispatch(createCategory(formDataToSend)).then(() => {
        navigate("/categories"); // Redirect after creation
      });
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ width: "400px", mt: 4 }}
    >
      <Typography variant="h5">
        {isEdit ? "Edit Category" : "Create Category"}
      </Typography>

      <TextField
        label="Category Name (Arabic)"
        name="name_ar"
        value={formData.name_ar}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />

      <TextField
        label="Category Name (English)"
        name="name_en"
        value={formData.name_en}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />

      <TextField
        label="Shop ID"
        name="shop_id"
        value={formData.shop_id}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />

      <TextField
        select
        label="Is Active?"
        name="is_active"
        value={formData.is_active}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        <MenuItem value="1">Yes</MenuItem>
        <MenuItem value="0">No</MenuItem>
      </TextField>

      <TextField
        select
        label="Is Interested?"
        name="is_interested"
        value={formData.is_interested}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      >
        <MenuItem value="1">Yes</MenuItem>
        <MenuItem value="0">No</MenuItem>
      </TextField>

      <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
        Upload Image
        <input type="file" name="image" hidden onChange={handleFileChange} />
      </Button>

      {status === "failed" && error && (
        <Alert severity="error">
          {typeof error === "string" ? error : "Failed to save category"}
        </Alert>
      )}
      {status === "succeeded" && (
        <Alert severity="success">Category saved successfully!</Alert>
      )}

      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={status === "loading"}
      >
        {status === "loading"
          ? "Saving..."
          : isEdit
            ? "Update Category"
            : "Create Category"}
      </Button>
    </Box>
  );
};

export default CategoryForm;
