import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../Products/productsSlice";
import { createOffer } from "./offersSlice";
import {
  Button,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";

const AddOfferForm = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.data);
  const [percentage, setPercentage] = useState("");
  const [productId, setProductId] = useState("");
  const [posterImage, setPosterImage] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!productId || !percentage || !posterImage) return;

    const formData = new FormData();
    formData.append("percentage", percentage);
    formData.append("product_id", productId);
    formData.append("poster_image", posterImage);

    await dispatch(createOffer(formData));
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "16px" }}
    >
      <FormControl fullWidth>
        <InputLabel>Product</InputLabel>
        <Select
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        >
          {products.map((product) => (
            <MenuItem key={product.id} value={product.id}>
              {product.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Percentage"
        type="number"
        value={percentage}
        onChange={(e) => setPercentage(e.target.value)}
        fullWidth
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setPosterImage(e.target.files[0])}
      />

      <Button type="submit" variant="contained" color="primary">
        Add Offer
      </Button>
    </form>
  );
};

export default AddOfferForm;
