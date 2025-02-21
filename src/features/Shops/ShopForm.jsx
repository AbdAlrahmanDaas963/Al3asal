import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createShop, updateShop } from "./shopSlice";
import { useLocation, useParams } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  MenuItem,
} from "@mui/material";

const ShopForm = ({ isEdit = false, initialData = {} }) => {
  const location = useLocation();
  const { shopId } = useParams();
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.shops);

  const [formData, setFormData] = useState({
    name: { ar: "", en: "" },
    is_interested: "1",
    image: null,
  });

  // Populate form when editing
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({
        name: initialData.name || { ar: "", en: "" },
        is_interested: initialData.is_interested?.toString() || "1",
        image: null,
      });
    }
  }, [initialData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;

    setFormData((prev) => {
      if (name.startsWith("name.")) {
        const lang = name.split(".")[1];
        return { ...prev, name: { ...prev.name, [lang]: value } };
      }
      return { ...prev, [name]: files ? files[0] : value };
    });
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
    if (formData.image) formPayload.append("image", formData.image);

    if (isEdit) {
      dispatch(updateShop({ id: shopId, shopData: formPayload }));
    } else {
      dispatch(createShop(formPayload));
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ width: "400px", mt: 4 }}
    >
      <Typography variant="h5">
        {isEdit ? "Edit Shop" : "Create Shop"}
      </Typography>

      <TextField
        label="Shop Name (Arabic)"
        name="name.ar"
        value={formData.name.ar}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />

      <TextField
        label="Shop Name (English)"
        name="name.en"
        value={formData.name.en}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
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
        <Alert severity="success">Shop saved successfully!</Alert>
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
            ? "Update Shop"
            : "Create Shop"}
      </Button>
    </Box>
  );
};

export default ShopForm;
