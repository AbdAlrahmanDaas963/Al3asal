import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, updateProduct } from "./productsSlice";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Container,
  Typography,
} from "@mui/material";

const EditProductForm = ({ productId, onClose }) => {
  const dispatch = useDispatch();
  const { selectedProduct, status, error } = useSelector(
    (state) => state.products
  );
  const [formData, setFormData] = useState({
    name_en: "",
    name_ar: "",
    image: null,
    is_hot: false,
    category_id: "",
    profit_percentage: "",
    price: "",
  });

  useEffect(() => {
    dispatch(fetchProductById(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (selectedProduct) {
      setFormData({
        name_en: selectedProduct.name?.en || "",
        name_ar: selectedProduct.name?.ar || "",
        is_hot: selectedProduct.is_hot === "1",
        category_id: selectedProduct.category_id || "",
        profit_percentage: selectedProduct.profit_percentage || "",
        price: selectedProduct.price || "",
      });
    }
  }, [selectedProduct]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedData = new FormData();
    updatedData.append("name[en]", formData.name_en);
    updatedData.append("name[ar]", formData.name_ar);
    updatedData.append("is_hot", formData.is_hot ? "1" : "0");
    updatedData.append("category_id", formData.category_id);
    updatedData.append("profit_percentage", formData.profit_percentage);
    updatedData.append("price", formData.price);
    if (formData.image) updatedData.append("image", formData.image);

    dispatch(updateProduct({ id: productId, productData: updatedData }));
    onClose();
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>
        Edit Product
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
          label="Price"
          name="price"
          type="number"
          value={formData.price}
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
          label="Category ID"
          name="category_id"
          value={formData.category_id}
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
        <input type="file" name="image" onChange={handleChange} />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={status === "loading"}
        >
          Update Product
        </Button>
        {error && <Typography color="error">Error: {error}</Typography>}
      </form>
    </Container>
  );
};

export default EditProductForm;
