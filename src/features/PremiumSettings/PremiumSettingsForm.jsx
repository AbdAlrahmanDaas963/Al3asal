// features/PremiumSettings/PremiumSettingsForm.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { updatePremiumPercentage } from "./premiumPercentageSlice";
import { Button, TextField, Box, Typography, Alert } from "@mui/material";

const PremiumSettingsForm = ({ currentValue }) => {
  const [percentage, setPercentage] = useState(currentValue || "");
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    const numericValue = Number(percentage);

    // if (isNaN(numericValue) {
    //   return;
    // }

    dispatch(updatePremiumPercentage(numericValue))
      .unwrap()
      .then(() => {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400 }}>
      <TextField
        fullWidth
        label="Premium Percentage"
        type="number"
        value={percentage}
        onChange={(e) => setPercentage(e.target.value)}
        inputProps={{ min: 0, max: 100, step: 0.1 }}
        margin="normal"
        required
      />

      <Button
        type="submit"
        variant="contained"
        sx={{ mt: 2 }}
        disabled={percentage === currentValue}
      >
        Update Percentage
      </Button>

      {success && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Premium percentage updated successfully!
        </Alert>
      )}
    </Box>
  );
};

export default PremiumSettingsForm;
