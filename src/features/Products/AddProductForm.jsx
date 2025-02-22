import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "./productsSlice";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Container,
  Typography,
} from "@mui/material";

const AddProductForm = ({ onSuccess }) => {
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.products);

  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    image: null,
    is_hot: false,
    category_id: "",
    profit_percentage: "",
    price: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "file") {
      setFormData({ ...formData, [name]: files[0] });
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name[en]", formData.name_en);
    form.append("name[ar]", formData.name_ar);
    form.append("image", formData.image);
    form.append("is_hot", formData.is_hot ? "1" : "0");
    form.append("category_id", formData.category_id);
    form.append("profit_percentage", formData.profit_percentage);
    form.append("price", formData.price);

    const result = await dispatch(createProduct(form));
    if (result.meta.requestStatus === "fulfilled") {
      onSuccess();
    }
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
        <TextField
          label="Category ID"
          name="category_id"
          value={formData.category_id}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Profit Percentage"
          name="profit_percentage"
          type="number"
          value={formData.profit_percentage}
          onChange={handleChange}
          required
          fullWidth
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
        <input type="file" name="image" onChange={handleChange} required />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={status === "loading"}
        >
          Add Product
        </Button>
        {error && <Typography color="error">{error}</Typography>}
      </form>
    </Container>
  );
};

export default AddProductForm;
