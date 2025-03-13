import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  Typography,
  Alert,
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
    name: { en: "", ar: "" },
    is_interested: "1",
    image: null,
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!shopFromState) {
      dispatch(fetchShopById(shopId));
    }
  }, [dispatch, shopId, shopFromState]);

  useEffect(() => {
    const shopData = shopFromState || selectedShop?.data;
    if (shopData) {
      setFormData({
        name: { en: shopData.name?.en || "", ar: shopData.name?.ar || "" },
        is_interested: shopData.is_interested?.toString() || "1",
        image: shopData.image || null,
      });
    }
  }, [shopFromState, selectedShop]);

  useEffect(() => {
    dispatch(resetStatus());
  }, [dispatch]);

  useEffect(() => {
    if (formData.image && typeof formData.image !== "string") {
      const objectUrl = URL.createObjectURL(formData.image);
      setPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [formData.image]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name.startsWith("name.")) {
        const lang = name.split(".")[1]; // Extract 'en' or 'ar'
        return {
          ...prev,
          name: { ...prev.name, [lang]: value }, // ✅ Correctly update the nested object
        };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const isFormUnchanged = () => {
    return (
      formData.name.en === selectedShop?.data?.name?.en &&
      formData.name.ar === selectedShop?.data?.name?.ar &&
      formData.is_interested ===
        selectedShop?.data?.is_interested?.toString() &&
      formData.image === selectedShop?.data?.image
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage("");
    setValidationErrors({});

    if (isFormUnchanged()) return;

    const updatedFormData = { ...formData };

    // ✅ Remove 'image' if no new file is uploaded
    if (!updatedFormData.image || typeof updatedFormData.image === "string") {
      delete updatedFormData.image;
    }

    dispatch(updateShop({ shop_id: shopId, formData: updatedFormData }))
      .unwrap()
      .then(() => navigate("/dashboard/shops"))
      .catch((err) => {
        console.error("Failed to update shop:", err);
        if (err.response && err.response.data.errors) {
          setValidationErrors(err.response.data.errors);
        } else {
          setErrorMessage(err.message || "An unexpected error occurred.");
        }
      });
  };

  const renderTextField = (label, name) => (
    <TextField
      label={label}
      name={name}
      value={formData[name]}
      onChange={handleChange}
      fullWidth
      margin="normal"
      required
      error={!!validationErrors[name]}
      helperText={validationErrors[name]}
    />
  );

  if (!selectedShop?.data && !shopFromState) {
    return <Typography variant="body1">Loading shop data...</Typography>;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        mt: 4,
      }}
    >
      <Typography variant="h5" gutterBottom>
        Edit Shop
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 2, width: "400px" }}
      >
        {renderTextField("Shop Name (English)", "name.en")}
        {renderTextField("Shop Name (Arabic)", "name.ar")}

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
          Upload New Image
          <input type="file" hidden onChange={handleFileChange} />
        </Button>

        {formData.image && (
          <Box mt={2}>
            <Typography variant="body2">Current Image:</Typography>
            <img
              src={
                typeof formData.image === "string"
                  ? formData.image
                  : preview || "/default-image.jpg"
              }
              alt="Shop"
              style={{
                width: "100%",
                maxWidth: "100%", // Ensure the image doesn't exceed the container width
                maxHeight: "300px", // Control the maximum height to avoid distortion
                objectFit: "cover", // Maintain aspect ratio while covering the area
              }}
            />
          </Box>
        )}

        {errorMessage && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {errorMessage}
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={status === "loading" || isFormUnchanged()}
        >
          {status === "loading" ? "Updating..." : "Update Shop"}
        </Button>
      </Box>
    </Box>
  );
};

export default EditShopForm;
