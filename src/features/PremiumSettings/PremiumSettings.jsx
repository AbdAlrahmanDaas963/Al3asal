import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  fetchPremiumPercentage,
  updatePremiumPercentage,
  fetchPointsPerDollar,
  updatePointsPerDollar,
  resetError,
} from "./premiumPercentageSlice";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Skeleton,
} from "@mui/material";

const PremiumSettings = () => {
  const { t, i18n } = useTranslation("premiumSettings");
  const dispatch = useDispatch();

  const {
    premiumPercentage,
    pointsPerDollar,
    error,
    isLoading: isInitialLoading,
  } = useSelector((state) => state.premiumPercentage);

  const [percentage, setPercentage] = useState(premiumPercentage || 0);
  const [pointsValue, setPointsValue] = useState(pointsPerDollar || "");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPointsSuccess, setShowPointsSuccess] = useState(false);
  const [isPremiumLoading, setIsPremiumLoading] = useState(false);
  const [isPointsLoading, setIsPointsLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchPremiumPercentage());
    dispatch(fetchPointsPerDollar());
  }, [dispatch]);

  useEffect(() => {
    if (premiumPercentage !== null && premiumPercentage !== undefined) {
      setPercentage(premiumPercentage);
    }
  }, [premiumPercentage]);

  useEffect(() => {
    if (pointsPerDollar !== null && pointsPerDollar !== undefined) {
      setPointsValue(pointsPerDollar);
    }
  }, [pointsPerDollar]);

  const handlePremiumSubmit = async (e) => {
    e.preventDefault();
    setIsPremiumLoading(true);
    try {
      const result = await dispatch(updatePremiumPercentage(percentage));
      if (updatePremiumPercentage.fulfilled.match(result)) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } catch {
      // handled in slice
    } finally {
      setIsPremiumLoading(false);
    }
  };

  const handlePointsSubmit = async (e) => {
    e.preventDefault();
    setIsPointsLoading(true);
    try {
      const formData = new FormData();
      formData.append("points_per_dollar", pointsValue);
      const result = await dispatch(updatePointsPerDollar(formData));
      if (updatePointsPerDollar.fulfilled.match(result)) {
        setShowPointsSuccess(true);
        setTimeout(() => setShowPointsSuccess(false), 3000);
      }
    } catch {
      // handled in slice
    } finally {
      setIsPointsLoading(false);
    }
  };

  const handleErrorClose = () => dispatch(resetError());

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {t("title")}
      </Typography>

      {error && (
        <Alert severity="error" onClose={handleErrorClose} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {showSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {t("updateSuccess")}
        </Alert>
      )}

      {/* Premium Percentage Form */}
      <Box
        component="form"
        onSubmit={handlePremiumSubmit}
        sx={{ maxWidth: 400 }}
      >
        {isInitialLoading ? (
          <>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={56}
              sx={{ mb: 2 }}
            />
            <Skeleton variant="rectangular" width={160} height={36} />
          </>
        ) : (
          <>
            <TextField
              fullWidth
              label={t("percentageLabel")}
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(parseFloat(e.target.value) || 0)}
              inputProps={{ min: 0, max: 100, step: 0.1 }}
              margin="normal"
              variant="outlined"
              required
              disabled={isPremiumLoading}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              disabled={isPremiumLoading || percentage === premiumPercentage}
              startIcon={
                isPremiumLoading ? <CircularProgress size={20} /> : null
              }
            >
              {isPremiumLoading ? t("updating") : t("updateButton")}
            </Button>
          </>
        )}
      </Box>

      {/* Points Per Dollar Form */}
      <Box mt={6}>
        <Typography variant="h5" gutterBottom>
          {t("pointsSectionTitle", "Loyalty Points Settings")}
        </Typography>

        {showPointsSuccess && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {t("pointsUpdateSuccess", "Points rate updated successfully!")}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handlePointsSubmit}
          sx={{ maxWidth: 400 }}
        >
          {isInitialLoading ? (
            <>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={56}
                sx={{ mb: 2 }}
              />
              <Skeleton variant="rectangular" width={160} height={36} />
            </>
          ) : (
            <>
              <TextField
                fullWidth
                label={t("pointsLabel", "Points per Dollar")}
                type="number"
                value={pointsValue}
                onChange={(e) => setPointsValue(e.target.value)}
                inputProps={{ min: 0, step: 0.01 }}
                margin="normal"
                variant="outlined"
                required
                disabled={isPointsLoading}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                disabled={isPointsLoading || pointsValue === pointsPerDollar}
                startIcon={
                  isPointsLoading ? <CircularProgress size={20} /> : null
                }
              >
                {isPointsLoading ? t("updating") : t("updateButton")}
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PremiumSettings;
