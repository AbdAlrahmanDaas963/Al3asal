import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  fetchPointsPerDollar,
  updatePointsPerDollar,
  resetLoyaltyError,
} from "./loyaltySettingsSlice";
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

const LoyaltySettings = () => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const { pointsPerDollar, status, isLoading, error, lastUpdated, message } =
    useSelector((state) => state.loyaltySettings);

  const [rate, setRate] = useState(pointsPerDollar || 0);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    dispatch(fetchPointsPerDollar());
  }, [dispatch]);

  useEffect(() => {
    if (pointsPerDollar !== null && pointsPerDollar !== undefined) {
      setRate(pointsPerDollar);
    }
  }, [pointsPerDollar]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(updatePointsPerDollar(rate));
      if (updatePointsPerDollar.fulfilled.match(resultAction)) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch (err) {
      // Error handled by Redux
    }
  };

  const handleErrorClose = () => {
    dispatch(resetLoyaltyError());
  };

  const formatDate = (dateString) => {
    if (!dateString) return t("neverUpdated");
    const date = new Date(dateString);
    try {
      return date.toLocaleString(i18n.language);
    } catch (e) {
      try {
        return date.toLocaleString(t("languageCode"));
      } catch (e) {
        return date.toLocaleString("en-US");
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t("loyaltySettings.title")}
      </Typography>

      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              {t("loyaltySettings.currentStatus")}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <StatusChip
              icon={status === 200 ? <CheckCircleIcon /> : <ErrorIcon />}
              label={
                status === 200
                  ? t("loyaltySettings.active")
                  : t("loyaltySettings.inactive")
              }
              activeStatus={status === 200}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              {t("loyaltySettings.lastUpdated")}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">{formatDate(lastUpdated)}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" onClose={handleErrorClose} sx={{ mb: 3 }}>
          {error.message}{" "}
          {error.statusCode &&
            `(${t("loyaltySettings.status")}: ${error.statusCode})`}
        </Alert>
      )}

      {message && !error && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {message}
        </Alert>
      )}

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {t("loyaltySettings.updateSuccess")}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400 }}>
        <TextField
          fullWidth
          label={t("loyaltySettings.pointsRateLabel")}
          type="number"
          value={rate}
          onChange={(e) => {
            const val = e.target.value;
            setRate(val === "" ? 0 : parseFloat(val) || 0);
          }}
          inputProps={{
            min: 0,
            max: 1,
            step: 0.01,
          }}
          margin="normal"
          variant="outlined"
          required
          disabled={isLoading}
        />

        <Typography variant="caption" display="block" gutterBottom>
          {t("loyaltySettings.pointsRateHelp", { rate })}
        </Typography>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          disabled={isLoading || rate === pointsPerDollar}
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {isLoading
            ? t("loyaltySettings.updating")
            : t("loyaltySettings.updateButton")}
        </Button>
      </Box>
    </Box>
  );
};

export default LoyaltySettings;
