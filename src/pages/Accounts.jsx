import React, { useState } from "react";
import {
  Stack,
  Typography,
  TextField,
  Switch,
  Divider,
  Button,
  FormControlLabel,
  Alert,
} from "@mui/material";

import MyPaper from "../components/common/MyPaper";

function CreateAccount() {
  // State for form fields
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    isAdmin: false,
  });

  // State for validation errors
  const [errors, setErrors] = useState({});

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle switch changes
  const handleSwitchChange = (e) => {
    setFormData((prev) => ({ ...prev, isAdmin: e.target.checked }));
  };

  // Form validation
  const validateForm = () => {
    let newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required.";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      // Prepare the data for the API
      const payload = {
        username: formData.username,
        password: formData.password,
        isAdmin: formData.isAdmin,
      };

      console.log("Submitting Data:", payload);

      // Call the API here (replace with your API call)
      // Example: await api.post('/accounts', payload);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Stack alignItems="flex-start" gap={3}>
        <Typography variant="h5">Create Profile</Typography>

        <MyPaper gap={2} width="100%">
          <Typography variant="h6">Personal Info</Typography>
          <Divider variant="fullWidth" color="white" />
          <Stack direction="row" gap={2}>
            <TextField
              label="User Name"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              error={Boolean(errors.username)}
              helperText={errors.username}
              fullWidth
              required
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              error={Boolean(errors.password)}
              helperText={errors.password}
              fullWidth
              required
            />
          </Stack>
        </MyPaper>

        <MyPaper width="100%">
          <Typography variant="h6">Account Settings</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isAdmin}
                onChange={handleSwitchChange}
              />
            }
            label="Admin Account"
          />
        </MyPaper>

        {Object.keys(errors).length > 0 && (
          <Alert severity="error" sx={{ width: "100%" }}>
            Please fix the errors above before submitting.
          </Alert>
        )}

        <Stack alignItems="flex-end" width="100%">
          <Button variant="contained" color="error" type="submit">
            Save Account
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}

export default CreateAccount;
