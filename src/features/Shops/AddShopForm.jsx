import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  MenuItem,
} from "@mui/material";
import { addShop, resetStatus } from "./shopSlice";

const AddShopForm = () => {
  const [formData, setFormData] = useState({
    "name[ar]": "",
    "name[en]": "",
    is_interested: "1",
    image: null,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector((state) => state.shops);

  // Reset status when the component mounts
  useEffect(() => {
    dispatch(resetStatus());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addShop(formData)).then(() => {
      if (status === "succeeded") {
        navigate("/dashboard/shops"); // Redirect to shops list
      }
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        mt: 4,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Add New Shop
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 2, width: "400px" }}
      >
        <TextField
          label="Shop Name (Arabic)"
          name="name[ar]"
          value={formData["name[ar]"]}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          label="Shop Name (English)"
          name="name[en]"
          value={formData["name[en]"]}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
        />
        <TextField
          select
          label="Is Interested"
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

        <Button variant="contained" component="label" fullWidth sx={{ mt: 2 }}>
          Upload Image
          <input type="file" name="image" hidden onChange={handleFileChange} />
        </Button>

        {status === "failed" && (
          <Alert severity="error">{error || "Failed to add shop"}</Alert>
        )}
        {status === "succeeded" && (
          <Alert severity="success">Shop added successfully!</Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Adding..." : "Add Shop"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddShopForm;
