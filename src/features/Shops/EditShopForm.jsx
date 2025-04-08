import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchShopById, updateShop, resetStatus } from "./shopSlice";

const EditShopForm = () => {
  const { shopId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const shopFromState = location.state?.item;
  const { status, error, selectedShop } = useSelector((state) => state.shops);

  const [formData, setFormData] = useState({
    name: "",
    is_interested: "1",
    image: null,
    originalImage: null,
  });

  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);
  const [localStatus, setLocalStatus] = useState("idle");

  // Fetch shop data
  useEffect(() => {
    dispatch(resetStatus()); // Reset status on mount
    if (!shopFromState) {
      dispatch(fetchShopById(shopId));
    }
  }, [dispatch, shopId, shopFromState]);

  // Sync Redux status with local status
  useEffect(() => {
    setLocalStatus(status);
  }, [status]);

  // Initialize form
  useEffect(() => {
    const shopData = shopFromState || selectedShop?.data;
    if (shopData && !isInitialized) {
      setFormData({
        name: shopData.name || "",
        is_interested: shopData.is_interested?.toString() || "1",
        image: shopData.image || null,
        originalImage: shopData.image || null,
      });
      setIsInitialized(true);
    }
  }, [shopFromState, selectedShop, isInitialized]);

  // Handle image preview
  useEffect(() => {
    if (formData.image && typeof formData.image !== "string") {
      const objectUrl = URL.createObjectURL(formData.image);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [formData.image]);

  // Handle navigation after success
  useEffect(() => {
    if (localStatus === "succeeded") {
      const timer = setTimeout(() => {
        navigate("/dashboard/shops");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [localStatus, navigate]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      dispatch(resetStatus());
    };
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setFileName(file.name);
    }
  };

  const isFormUnchanged = () => {
    const { originalImage, ...compareData } = formData;
    const shopData = shopFromState || selectedShop?.data;
    return (
      compareData.name === (shopData?.name || "") &&
      compareData.is_interested ===
        (shopData?.is_interested?.toString() || "1") &&
      (originalImage === compareData.image ||
        (typeof compareData.image === "string" &&
          compareData.image === originalImage))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});
    setLocalStatus("loading");

    if (isFormUnchanged()) return;

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("is_interested", formData.is_interested);

    // Only append image if it's a new file (not the existing URL string)
    if (formData.image && typeof formData.image !== "string") {
      formDataToSend.append("image", formData.image);
    }

    try {
      await dispatch(
        updateShop({
          shop_id: shopId,
          formData: formDataToSend,
        })
      ).unwrap();
      setLocalStatus("succeeded");
    } catch (err) {
      setLocalStatus("failed");
      if (err.errors) {
        setValidationErrors(err.errors);
      }
      console.error("Update error:", err);
    }
  };

  if (!isInitialized) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", p: 3 }}>
      <Typography variant="h5" gutterBottom align="center">
        Edit Shop
      </Typography>

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <TextField
          label="Shop Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
          error={!!validationErrors.name}
          helperText={validationErrors.name}
          autoFocus
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

        <Button variant="outlined" component="label" fullWidth sx={{ mt: 2 }}>
          {fileName || "Upload New Image"}
          <input
            type="file"
            hidden
            onChange={handleFileChange}
            accept="image/*"
          />
        </Button>

        {(formData.originalImage || preview) && (
          <Box mt={2}>
            <Typography variant="subtitle2" gutterBottom>
              {fileName ? "New Preview" : "Current Image"}
            </Typography>
            <img
              src={preview || formData.originalImage}
              alt="Shop preview"
              style={{
                maxWidth: "100%",
                maxHeight: 300,
                borderRadius: 4,
              }}
            />
          </Box>
        )}

        {localStatus === "failed" && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error || "Failed to update shop"}
          </Alert>
        )}

        {localStatus === "succeeded" && (
          <Alert severity="success" sx={{ mt: 2 }}>
            Shop updated successfully!
          </Alert>
        )}

        <Box display="flex" gap={2} mt={3}>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate("/dashboard/shops")}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={localStatus === "loading" || isFormUnchanged()}
            startIcon={
              localStatus === "loading" ? <CircularProgress size={20} /> : null
            }
          >
            {localStatus === "loading" ? "Updating..." : "Update Shop"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default EditShopForm;
