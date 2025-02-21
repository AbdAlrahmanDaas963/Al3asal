import { fetchShops } from "../Shops/shopSlice"; // Adjust import path as necessary
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
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { createCategory } from "./categorySlice"; // Adjust import path as necessary

import { useNavigate } from "react-router-dom"; // Import useNavigate

const AddCategoryForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Use the navigate function

  const [formData, setFormData] = useState({
    name: { en: "", ar: "" },
    image: null,
    is_interested: "1",
    shop_id: "", // Required shop_id field
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [preview, setPreview] = useState(null);

  // Get shops from Redux store
  const {
    shops,
    status: shopsStatus,
    error: shopsError,
  } = useSelector((state) => state.shops);

  useEffect(() => {
    if (shopsStatus === "idle") {
      dispatch(fetchShops()); // Fetch shops if not already done
    }
  }, [dispatch, shopsStatus]);

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
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setValidationErrors({});

    // Simple validation to check if shop_id is provided
    if (!formData.shop_id) {
      setValidationErrors((prev) => ({
        ...prev,
        shop_id: "Shop ID is required",
      }));
      return;
    }

    // Dispatch the action to create the category
    dispatch(createCategory(formData))
      .unwrap()
      .then(() => {
        // Navigate back to the categories page after success
        navigate("/dashboard/category");
      })
      .catch((err) => {
        console.error("Failed to create category:", err);
        setErrorMessage(err.message || "An unexpected error occurred.");
      });
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
        Add New Category
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 2, width: "400px" }}
      >
        <TextField
          label="Category Name (English)"
          name="en"
          value={formData.name.en}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!validationErrors.name?.en}
          helperText={validationErrors.name?.en}
        />
        <TextField
          label="Category Name (Arabic)"
          name="ar"
          value={formData.name.ar}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!validationErrors.name?.ar}
          helperText={validationErrors.name?.ar}
        />

        <FormControl
          fullWidth
          margin="normal"
          required
          error={!!validationErrors.shop_id}
        >
          <InputLabel>Shop</InputLabel>
          <Select
            label="Shop"
            name="shop_id"
            value={formData.shop_id}
            onChange={handleChange}
          >
            {shops.data && shops.data.length > 0 ? (
              shops.data.map((shop) => (
                <MenuItem key={shop.id} value={shop.id}>
                  {shop.name} {/* Display shop name */}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No shops available</MenuItem>
            )}
          </Select>
          {validationErrors.shop_id && (
            <FormHelperText>{validationErrors.shop_id}</FormHelperText>
          )}
        </FormControl>

        <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
          Upload Image
          <input type="file" hidden onChange={handleFileChange} />
        </Button>

        {formData.image && (
          <Box mt={2}>
            <Typography variant="body2">Image Preview:</Typography>
            <img
              src={preview || URL.createObjectURL(formData.image)}
              alt="Category"
              style={{ width: "100%", maxHeight: "150px" }}
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
        >
          Create Category
        </Button>
      </Box>
    </Box>
  );
};

export default AddCategoryForm;
