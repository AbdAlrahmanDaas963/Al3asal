import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Alert,
} from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategoryById,
  updateCategory,
  resetStatus,
} from "./categorySlice"; // Assuming you have these actions

const EditCategoryForm = () => {
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

  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [preview, setPreview] = useState(null);

  // Fetch category data on mount if not present in state
  useEffect(() => {
    if (!categoryFromState && !selectedCategory?.data) {
      dispatch(fetchCategoryById(categoryId));
    }
  }, [dispatch, categoryId, categoryFromState, selectedCategory?.data]);

  // Set form data when category data is fetched
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

  useEffect(() => {
    dispatch(resetStatus());
  }, [dispatch]);

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
        const lang = name.split(".")[1]; // Extract 'en' or 'ar'
        return {
          ...prev,
          name: { ...prev.name, [lang]: value }, // ✅ Correctly update the nested object
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const isFormUnchanged = () => {
    return (
      formData.name.en === selectedCategory?.data?.name?.en &&
      formData.name.ar === selectedCategory?.data?.name?.ar &&
      formData.image === selectedCategory?.data?.image
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setValidationErrors({});

    if (isFormUnchanged()) return;

    dispatch(updateCategory({ id: categoryId, categoryData: formData }))
      .unwrap()
      .then(() => navigate("/dashboard/categories"))
      .catch((err) => {
        console.error("Failed to update category:", err);
        if (err.response && err.response.data.errors) {
          setValidationErrors(err.response.data.errors);
        } else {
          setErrorMessage(err.message || "An unexpected error occurred.");
        }
      });
  };

  const renderTextField = (label, name) => (
    <TextField
      label={label}
      name={name}
      value={formData[name]}
      onChange={handleChange}
      fullWidth
      margin="normal"
      required
      error={!!validationErrors[name]}
      helperText={validationErrors[name]}
    />
  );

  if (status === "loading" || (!selectedCategory?.data && !categoryFromState)) {
    return <Typography variant="body1">Loading category data...</Typography>;
  }

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
        Edit Category
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 2, width: "400px" }}
      >
        {renderTextField("Category Name (English)", "name.en")}
        {renderTextField("Category Name (Arabic)", "name.ar")}

        <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
          Upload New Image
          <input type="file" hidden onChange={handleFileChange} />
        </Button>

        {formData.image && (
          <Box mt={2}>
            <Typography variant="body2">Current Image:</Typography>
            <img
              src={
                typeof formData.image === "string"
                  ? formData.image
                  : preview || "/default-image.jpg"
              }
              alt="Category"
              style={{
                width: "100%", // Ensure the image fills the width of the container
                maxWidth: "100%", // Ensure image doesn't exceed container width
                maxHeight: "300px", // Adjust max height for better fitting
                objectFit: "cover", // Maintain aspect ratio while covering the container
              }}
            />
          </Box>
        )}

        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={status === "loading" || isFormUnchanged()}
        >
          {status === "loading" ? "Updating..." : "Update Category"}
        </Button>
      </Box>
    </Box>
  );
};

export default EditCategoryForm;
