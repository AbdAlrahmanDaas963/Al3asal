import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "./productsSlice";
import { fetchShops } from "../../features/shops/shopSlice";
import { fetchCategories } from "../../features/Categories/categorySlice";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Container,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  FormHelperText,
  Snackbar,
  Alert,
} from "@mui/material";

const AddProductForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.products);
  const { shops, status: shopsStatus } = useSelector((state) => state.shops);
  const { categories, status: categoriesStatus } = useSelector(
    (state) => state.categories
  );

  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    image: null,
    is_hot: false,
    category_id: "",
    profit_percentage: "",
    price: "",
    description_en: "",
    description_ar: "",
    shop_id: "",
  });

  const [imageError, setImageError] = useState(""); // State for image validation errors
  const [profitPercentageError, setProfitPercentageError] = useState(""); // State for profit percentage validation errors
  const [snackbarOpen, setSnackbarOpen] = useState(false); // State for success message

  useEffect(() => {
    if (shopsStatus === "idle") dispatch(fetchShops());
    if (categoriesStatus === "idle") dispatch(fetchCategories());
  }, [dispatch, shopsStatus, categoriesStatus]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "image") {
      const file = files[0];
      if (!file) {
        setImageError("Image is required");
      } else if (file.size > 100 * 1024) {
        setImageError("Image size must be less than 100KB");
      } else if (
        !["image/jpeg", "image/png", "image/jpg"].includes(file.type)
      ) {
        setImageError("Image must be a JPG, JPEG, or PNG file");
      } else {
        setImageError(""); // Clear error if validation passes
      }
    }

    if (name === "profit_percentage") {
      if (value > 100) {
        setProfitPercentageError(
          "Profit percentage must not be greater than 100"
        );
      } else {
        setProfitPercentageError(""); // Clear error if validation passes
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "file" ? files[0] : type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate image before submission
    if (!formData.image || imageError) {
      setImageError("Please upload a valid image");
      return;
    }

    // Validate profit percentage before submission
    if (formData.profit_percentage > 100) {
      setProfitPercentageError(
        "Profit percentage must not be greater than 100"
      );
      return;
    }

    if (!formData.shop_id || !formData.category_id) {
      console.error("Category ID or Shop ID is missing");
      return;
    }

    const form = new FormData();
    form.append("name[en]", formData.name_en);
    form.append("name[ar]", formData.name_ar);
    form.append("image", formData.image); // Append the image file
    form.append("is_hot", formData.is_hot ? "1" : "0");
    form.append("category_id", formData.category_id);
    form.append("profit_percentage", formData.profit_percentage);
    form.append("price", formData.price);
    form.append("description[en]", formData.description_en);
    form.append("description[ar]", formData.description_ar);
    form.append("shop_id", formData.shop_id);

    try {
      const result = await dispatch(createProduct(form));
      if (result.meta.requestStatus === "fulfilled") {
        setSnackbarOpen(true); // Show success message
        if (typeof onSuccess === "function") {
          onSuccess();
        }
      } else {
        console.error("Product creation failed:", result.payload);
      }
    } catch (error) {
      console.error("Error while creating product:", error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>
        Add Product
      </Typography>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <TextField
          label="Product Name (English)"
          name="name_en"
          value={formData.name_en}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Product Name (Arabic)"
          name="name_ar"
          value={formData.name_ar}
          onChange={handleChange}
          required
          fullWidth
        />

        <FormControl fullWidth required>
          <InputLabel>Shop</InputLabel>
          <Select
            name="shop_id"
            value={formData.shop_id}
            onChange={handleChange}
            label="Shop"
          >
            {shops.data?.length > 0 ? (
              shops.data.map((shop) => (
                <MenuItem key={shop.id} value={shop.id}>
                  {shop.name}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No shops available</MenuItem>
            )}
          </Select>
          {!formData.shop_id && (
            <FormHelperText error>Shop is required</FormHelperText>
          )}
        </FormControl>

        <FormControl fullWidth required>
          <InputLabel>Category</InputLabel>
          <Select
            name="category_id"
            value={formData.category_id}
            onChange={handleChange}
            label="Category"
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200, // Limit dropdown height
                },
              },
            }}
          >
            {categories?.length > 0 ? (
              categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name.en}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled>No categories available</MenuItem>
            )}
          </Select>
          {!formData.category_id && (
            <FormHelperText error>Category is required</FormHelperText>
          )}
        </FormControl>

        <TextField
          label="Profit Percentage"
          name="profit_percentage"
          type="number"
          value={formData.profit_percentage}
          onChange={handleChange}
          required
          fullWidth
          error={!!profitPercentageError}
          helperText={profitPercentageError}
        />
        <TextField
          label="Price"
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Description (English)"
          name="description_en"
          value={formData.description_en}
          onChange={handleChange}
          fullWidth
        />
        <TextField
          label="Description (Arabic)"
          name="description_ar"
          value={formData.description_ar}
          onChange={handleChange}
          fullWidth
        />

        <FormControlLabel
          control={
            <Checkbox
              name="is_hot"
              checked={formData.is_hot}
              onChange={handleChange}
            />
          }
          label="Hot Product"
        />

        <input
          type="file"
          name="image"
          onChange={handleChange}
          accept="image/jpeg, image/png, image/jpg"
          required
        />
        {imageError && (
          <Typography color="error" variant="body2">
            {imageError}
          </Typography>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={status === "loading"}
        >
          {status === "loading" ? (
            <CircularProgress size={24} />
          ) : (
            "Add Product"
          )}
        </Button>
        {error && <Typography color="error">{error}</Typography>}
      </form>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="success">
          Product added successfully!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default AddProductForm;
