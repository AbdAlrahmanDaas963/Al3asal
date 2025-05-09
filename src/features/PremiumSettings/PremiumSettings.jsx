import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  fetchPremiumPercentage,
  updatePremiumPercentage,
  resetError,
} from "./premiumPercentageSlice";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Grid,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const StatusChip = styled(Chip, {
  shouldForwardProp: (prop) => prop !== "activeStatus",
})(({ theme, activeStatus }) => ({
  backgroundColor: activeStatus
    ? theme.palette.success.light
    : theme.palette.error.light,
  color: theme.palette.common.white,
  fontWeight: "bold",
}));

const PremiumSettings = () => {
  const { t, i18n } = useTranslation("premiumSettings");
  const dispatch = useDispatch();
  const { value, status, statusCode, isLoading, error, lastUpdated } =
    useSelector((state) => state.premiumPercentage);

  const [percentage, setPercentage] = useState(value || 0);
  const [showSuccess, setShowSuccess] = useState(false);

  // Initialize and sync with Redux state
  useEffect(() => {
    dispatch(fetchPremiumPercentage());
  }, [dispatch]);

  // Update local state when Redux state changes
  useEffect(() => {
    if (value !== null && value !== undefined) {
      setPercentage(value);
    }
  }, [value]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resultAction = await dispatch(updatePremiumPercentage(percentage));

      if (updatePremiumPercentage.fulfilled.match(resultAction)) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);

        // No need to manually setPercentage here because:
        // 1. The update API should return the new value
        // 2. Our useEffect will sync it automatically
      }
    } catch (err) {
      // Error handling is already done by Redux
    }
  };

  const handleErrorClose = () => {
    dispatch(resetError());
  };

  const formatDate = (dateString) => {
    if (!dateString) return t("neverUpdated");
    const date = new Date(dateString);

    // Use this robust formatting approach:
    try {
      // First try the current i18n language
      return date.toLocaleString(i18n.language);
    } catch (e) {
      try {
        // Fallback to the translated languageCode
        return date.toLocaleString(t("languageCode"));
      } catch (e) {
        // Final fallback to English
        return date.toLocaleString("en-US");
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t("title")}
      </Typography>

      {/* <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">{t("currentStatus")}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <StatusChip
              icon={status ? <CheckCircleIcon /> : <ErrorIcon />}
              label={status ? t("active") : t("inactive")}
              activeStatus={status}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">{t("httpStatus")}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Chip
              label={`${statusCode || "--"}`}
              color={statusCode === 200 ? "success" : "default"}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">{t("lastUpdated")}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">{formatDate(lastUpdated)}</Typography>
          </Grid>
        </Grid>
      </Paper> */}

      {error && (
        <Alert severity="error" onClose={handleErrorClose} sx={{ mb: 3 }}>
          {error.message}{" "}
          {error.statusCode && `(${t("status")}: ${error.statusCode})`}
        </Alert>
      )}

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {t("updateSuccess")}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400 }}>
        <TextField
          fullWidth
          label={t("percentageLabel")}
          type="number"
          value={percentage}
          onChange={(e) => {
            const val = e.target.value;
            setPercentage(val === "" ? 0 : parseFloat(val) || 0);
          }}
          inputProps={{
            min: 0,
            max: 100,
            step: 0.1,
          }}
          margin="normal"
          variant="outlined"
          required
          disabled={isLoading}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          disabled={isLoading || percentage === value}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading ? t("updating") : t("updateButton")}
        </Button>
      </Box>
    </Box>
  );
};

export default PremiumSettings;
