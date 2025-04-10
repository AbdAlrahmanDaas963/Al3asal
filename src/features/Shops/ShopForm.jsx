import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  TextField,
  Box,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import {
  createShop,
  updateShop,
  fetchShopById,
  resetStatus,
} from "./shopSlice";

const ShopForm = ({ isEdit }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { shopId } = useParams();

  const { selectedShop, status, error } = useSelector((state) => state.shops);

  const [formData, setFormData] = useState({
    name: { en: "", ar: "" },
    is_interested: 0,
    image: null,
    previewImage: null,
  });

  useEffect(() => {
    if (isEdit && shopId) {
      dispatch(fetchShopById(shopId));
    }
    return () => dispatch(resetStatus());
  }, [dispatch, isEdit, shopId]);

  useEffect(() => {
    if (isEdit && selectedShop) {
      setFormData({
        name: {
          en: selectedShop.name?.en || "",
          ar: selectedShop.name?.ar || "",
        },
        is_interested: selectedShop.is_interested || 0,
        image: selectedShop.image || null,
        previewImage: selectedShop.image || null,
      });
    }
  }, [selectedShop, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("name.")) {
      const lang = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        name: {
          ...prev.name,
          [lang]: value,
        },
      }));
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked ? 1 : 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
        previewImage: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEdit) {
      dispatch(updateShop({ shop_id: shopId, formData }))
        .unwrap()
        .then(() => navigate("/dashboard/shops"))
        .catch(console.error);
    } else {
      dispatch(createShop(formData))
        .unwrap()
        .then(() => navigate("/dashboard/shops"))
        .catch(console.error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 3 }}>
      <TextField
        fullWidth
        label="Name (English)"
        name="name.en"
        value={formData.name.en}
        onChange={handleChange}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Name (Arabic)"
        name="name.ar"
        value={formData.name.ar}
        onChange={handleChange}
        margin="normal"
        required
      />

      <FormControlLabel
        control={
          <Checkbox
            name="is_interested"
            checked={!!formData.is_interested}
            onChange={handleChange}
          />
        }
        label="Is Interested"
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: "block", margin: "20px 0" }}
      />

      {formData.previewImage && (
        <img
          src={formData.previewImage}
          alt="Preview"
          style={{ maxWidth: "200px", marginBottom: "20px" }}
        />
      )}

      <Button type="submit" variant="contained" disabled={status === "loading"}>
        {isEdit ? "Update Shop" : "Create Shop"}
      </Button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </Box>
  );
};

export default ShopForm;
