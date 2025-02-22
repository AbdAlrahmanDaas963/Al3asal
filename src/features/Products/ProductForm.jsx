import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Container,
  Typography,
} from "@mui/material";

const ProductForm = ({ initialData = {}, onSubmit }) => {
  const [formData, setFormData] = useState({
    nameEn: "",
    nameAr: "",
    image: null,
    isHot: false,
    categoryId: "",
    profitPercentage: "",
    price: "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        nameEn: initialData?.name?.en || "",
        nameAr: initialData?.name?.ar || "",
        isHot: initialData?.is_hot === 1,
        categoryId: initialData?.category_id || "",
        profitPercentage: initialData?.profit_percentage || "",
        price: initialData?.price || "",
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setFormData((prev) => ({ ...prev, image: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom>
        Product Form
      </Typography>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <TextField
          label="Product Name (English)"
          name="nameEn"
          value={formData.nameEn}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Product Name (Arabic)"
          name="nameAr"
          value={formData.nameAr}
          onChange={handleChange}
          required
          fullWidth
        />
        <input type="file" name="image" onChange={handleChange} />
        <FormControlLabel
          control={
            <Checkbox
              name="isHot"
              checked={formData.isHot}
              onChange={handleChange}
            />
          }
          label="Hot Product"
        />
        <TextField
          label="Category ID"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Profit Percentage"
          name="profitPercentage"
          value={formData.profitPercentage}
          onChange={handleChange}
          required
          fullWidth
        />
        <TextField
          label="Price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Submit
        </Button>
      </form>
    </Container>
  );
};

export default ProductForm;
