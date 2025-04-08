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
  CircularProgress,
} from "@mui/material";
import { resetStatus, createShop } from "./shopSlice";

const AddShopForm = () => {
  const [formData, setFormData] = useState({
    "name[ar]": "",
    "name[en]": "",
    is_interested: "1",
    image: null,
  });
  const [localStatus, setLocalStatus] = useState("idle"); // Track status locally
  const [fileName, setFileName] = useState(""); // Track uploaded file name

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status: reduxStatus, error } = useSelector((state) => state.shops);

  // Sync Redux status with local status and reset on unmount
  useEffect(() => {
    setLocalStatus(reduxStatus);

    return () => {
      dispatch(resetStatus());
    };
  }, [reduxStatus, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    setFileName(file ? file.name : "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalStatus("loading");

    try {
      const resultAction = await dispatch(createShop(formData));
      if (createShop.fulfilled.match(resultAction)) {
        setTimeout(() => navigate("/dashboard/shops"), 1500); // Show success message before redirect
      }
    } catch (err) {
      console.error("Failed to create shop:", err);
    }
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
        noValidate
      >
        <TextField
          label="Shop Name (Arabic)"
          name="name[ar]"
          value={formData["name[ar]"]}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          autoFocus
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
          {fileName || "Upload Image"}
          <input
            type="file"
            name="image"
            hidden
            onChange={handleFileChange}
            accept="image/*"
          />
        </Button>
        {fileName && (
          <Typography variant="caption" color="text.secondary">
            Selected: {fileName}
          </Typography>
        )}

        {localStatus === "failed" && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error || "Failed to add shop"}
          </Alert>
        )}
        {localStatus === "succeeded" && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Shop added successfully!
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={localStatus === "loading"}
          startIcon={
            localStatus === "loading" ? <CircularProgress size={20} /> : null
          }
        >
          {localStatus === "loading" ? "Adding Shop..." : "Add Shop"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddShopForm;
