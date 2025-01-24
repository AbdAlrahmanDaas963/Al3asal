import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createShop, updateShop } from "./shopSlice";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";

const ShopForm = ({ isEdit = false, shopId = null, initialData = {} }) => {
  const [formData, setFormData] = useState({
    "name[ar]": initialData["name[ar]"] || "",
    "name[en]": initialData["name[en]"] || "",
    image: null,
    is_interested: initialData.is_interested || "1",
  });

  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.shops);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEdit) {
      dispatch(updateShop({ id: shopId, shopData: formData }));
    } else {
      dispatch(createShop(formData));
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
        label="Shop Name (AR)"
        name="name[ar]"
        value={formData["name[ar]"]}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Shop Name (EN)"
        name="name[en]"
        value={formData["name[en]"]}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Interested (1/0)"
        name="is_interested"
        value={formData.is_interested}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />
      <Button variant="contained" component="label" sx={{ mt: 2 }}>
        Upload Image
        <input type="file" name="image" hidden onChange={handleChange} />
      </Button>
      {status === "failed" && (
        <Alert severity="error">
          {error?.message || "Failed to save shop"}
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
