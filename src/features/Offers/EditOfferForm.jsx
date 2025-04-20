import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Stack,
  Card,
  CardContent,
  InputAdornment,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";
import { updateOffer, resetOperationStatus } from "./offersSlice";
import { useTranslation } from "react-i18next";

const EditOfferForm = () => {
  const { t } = useTranslation("offers");
  const { state } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { operation } = useSelector((state) => state.offers);

  const currentOffer = state?.offer;

  const [formData, setFormData] = useState({
    percentage: "",
    poster_image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (currentOffer) {
      setFormData({
        percentage: currentOffer.percentage || "",
        poster_image: null,
      });
      setImagePreview(currentOffer.poster_image || null);
    }

    return () => {
      dispatch(resetOperationStatus());
    };
  }, [currentOffer, dispatch]);

  useEffect(() => {
    if (operation.status === "succeeded") {
      navigate("/dashboard/offers", {
        state: { success: t("updateSuccess") },
      });
    }
  }, [operation.status, navigate, t]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const MAX_FILE_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      setValidationErrors({
        ...validationErrors,
        poster_image: t("imageSizeError"),
      });
      e.target.value = "";
      setFormData((prev) => ({ ...prev, poster_image: null }));
      setImagePreview(currentOffer?.poster_image || null);
      return;
    }

    if (!file.type.match("image.*")) {
      setValidationErrors({
        ...validationErrors,
        poster_image: t("imageTypeError"),
      });
      e.target.value = "";
      setFormData((prev) => ({ ...prev, poster_image: null }));
      setImagePreview(currentOffer?.poster_image || null);
      return;
    }

    setValidationErrors({
      ...validationErrors,
      poster_image: undefined,
    });
    setFormData((prev) => ({ ...prev, poster_image: file }));
    setImagePreview(URL.createObjectURL(file));
  };

  const handlePercentageChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, percentage: value }));
    setValidationErrors((prev) => ({ ...prev, percentage: null }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.percentage) {
      errors.percentage = t("percentageRequired");
    } else if (formData.percentage < 0 || formData.percentage > 100) {
      errors.percentage = t("percentageRange");
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const form = new FormData();
    form.append("percentage", formData.percentage);
    if (formData.poster_image) {
      form.append("poster_image", formData.poster_image);
    }

    try {
      await dispatch(
        updateOffer({
          id: currentOffer.id,
          formData: form,
        })
      );
    } catch (error) {
      setValidationErrors({
        submit: error.message || t("updateError"),
      });
    }
  };

  const getDisplayName = (nameObj) => {
    if (!nameObj) return "N/A";
    if (typeof nameObj === "string") return nameObj;
    return nameObj.en || nameObj.ar || "N/A";
  };

  if (!currentOffer) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {t("offerNotFound")}
        </Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/dashboard/offers")}
        >
          {t("backToOffers")}
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" gutterBottom>
            {t("editOfferTitle")}
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {/* Read-only Product Info Section */}
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              {t("productInfo")}
            </Typography>
            <Stack spacing={2} sx={{ mb: 3 }}>
              <TextField
                label={t("productName")}
                value={getDisplayName(currentOffer.product?.name)}
                fullWidth
                disabled
              />
              <TextField
                label={t("shop")}
                value={getDisplayName(currentOffer.product?.shop?.name)}
                fullWidth
                disabled
              />
              <TextField
                label={t("originalPrice")}
                value={
                  currentOffer.product?.price
                    ? `$${currentOffer.product.price.toFixed(2)}`
                    : "N/A"
                }
                fullWidth
                disabled
              />
            </Stack>

            {/* Editable Fields Section */}
            <Typography variant="subtitle1" sx={{ mt: 2, mb: 1 }}>
              {t("offerDetails")}
            </Typography>
            <Stack spacing={2} sx={{ mb: 3 }}>
              <TextField
                label={t("discountPercentage")}
                name="percentage"
                type="number"
                value={formData.percentage}
                onChange={handlePercentageChange}
                fullWidth
                required
                error={!!validationErrors.percentage}
                helperText={validationErrors.percentage}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">%</InputAdornment>
                  ),
                  inputProps: { min: 0, max: 100, step: 0.01 },
                }}
              />

              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  {t("posterImage")}
                </Typography>
                {imagePreview && (
                  <Box
                    component="img"
                    src={imagePreview}
                    alt="Current Offer"
                    sx={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      borderRadius: "8px",
                      mb: 2,
                      display: "block",
                    }}
                  />
                )}
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUpload />}
                >
                  {formData.poster_image
                    ? t("changeImage")
                    : t("uploadNewImage")}
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    hidden
                  />
                </Button>
                {validationErrors.poster_image && (
                  <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                    {validationErrors.poster_image}
                  </Typography>
                )}
              </Box>
            </Stack>

            {/* Calculated Price Preview */}
            {currentOffer.product?.price && formData.percentage && (
              <Box
                sx={{ mb: 3, p: 2, bgcolor: "action.hover", borderRadius: 1 }}
              >
                <Typography variant="subtitle2">{t("pricePreview")}</Typography>
                <Typography>
                  {t("original")}: ${currentOffer.product.price.toFixed(2)}
                </Typography>
                <Typography>
                  {t("discount")}: {formData.percentage}%
                </Typography>
                <Typography variant="h6" sx={{ mt: 1 }}>
                  {t("newPrice")}: $
                  {(
                    currentOffer.product.price *
                    (1 - formData.percentage / 100)
                  ).toFixed(2)}
                </Typography>
              </Box>
            )}

            {/* Action Buttons */}
            <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate("/dashboard/offers")}
                disabled={operation.status === "loading"}
              >
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={operation.status === "loading"}
              >
                {operation.status === "loading" ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  t("updateOffer")
                )}
              </Button>
            </Stack>

            {/* Error Feedback */}
            {validationErrors.submit && (
              <Alert severity="error" sx={{ mt: 3 }}>
                {validationErrors.submit}
              </Alert>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EditOfferForm;
