import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateCategory, createCategory } from "./categorySlice";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  MenuItem,
} from "@mui/material";

const CategoryForm = ({
  isEdit = false,
  categoryId = null,
  initialData = {},
}) => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.category);

  // Set initial form data properly
  const [formData, setFormData] = useState({
    name: {
      ar: initialData?.name?.ar || "",
      en: initialData?.name?.en || "",
    },
    image: null,
    is_interested: initialData?.is_interested || "1",
  });

  // Update formData when initialData changes (needed for edit mode)
  useEffect(() => {
    setFormData({
      name: {
        ar: initialData?.name?.ar || "",
        en: initialData?.name?.en || "",
      },
      image: null, // Keep existing image unless user uploads a new one
      is_interested: initialData?.is_interested || "1",
    });
  }, [initialData]);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name.startsWith("name.")) {
      // Handle nested name fields properly
      const lang = name.split(".")[1];
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
        [name]: files ? files[0] : value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isEdit && !formData.image) {
      alert("Please upload an image");
      return;
    }

    const formPayload = new FormData();
    formPayload.append("name[ar]", formData.name.ar);
    formPayload.append("name[en]", formData.name.en);
    formPayload.append("is_interested", formData.is_interested);

    if (formData.image) {
      formPayload.append("image", formData.image);
    }

    if (isEdit) {
      dispatch(updateCategory({ id: categoryId, categoryData: formPayload }));
    } else {
      dispatch(createCategory(formPayload));
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
        label="Category Name (AR)"
        name="name.ar"
        value={formData.name.ar}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Category Name (EN)"
        name="name.en"
        value={formData.name.en}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <TextField
        select
        label="Interested?"
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

      <Button variant="contained" component="label" sx={{ mt: 2 }}>
        Upload Image
        <input type="file" name="image" hidden onChange={handleChange} />
      </Button>

      {status === "failed" && error && (
        <Alert severity="error">
          {error?.message || "An unexpected error occurred."}
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
