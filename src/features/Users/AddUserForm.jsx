import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Alert,
  CircularProgress,
  useMediaQuery,
  useTheme,
  Paper,
} from "@mui/material";
import { addUser } from "../Auth/userSlice";

const AddUserForm = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.users);

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    is_admin: "1",
  });
  const [formErrors, setFormErrors] = useState({
    username: false,
    password: false,
  });

  // Reset form and status when component unmounts

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: false });
    }
  };

  const validateForm = () => {
    const errors = {
      username: formData.username.trim() === "",
      password: formData.password.trim() === "",
    };
    setFormErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(addUser(formData));
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        p: isMobile ? 2 : 4,
        width: "100%",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: isMobile ? 2 : 4,
          width: "100%",
          maxWidth: "500px",
          borderRadius: "12px",
        }}
      >
        <Typography variant="h5" gutterBottom align="center" sx={{ mb: 3 }}>
          Add New User
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
          <TextField
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            error={formErrors.username}
            helperText={formErrors.username ? "Username is required" : ""}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            error={formErrors.password}
            helperText={formErrors.password ? "Password is required" : ""}
            sx={{ mb: 2 }}
            inputProps={{
              minLength: 6,
            }}
          />

          <TextField
            select
            label="Role"
            name="is_admin"
            value={formData.is_admin}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            sx={{ mb: 3 }}
          >
            <MenuItem value="1">Admin</MenuItem>
            <MenuItem value="0">Employee</MenuItem>
          </TextField>

          {status === "failed" && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error?.message || "Failed to add user. Please try again."}
            </Alert>
          )}

          {status === "succeeded" && (
            <Alert severity="success" sx={{ mb: 2 }}>
              User added successfully!
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size={isMobile ? "medium" : "large"}
            disabled={status === "loading"}
            sx={{
              py: isMobile ? 1 : 1.5,
              mt: 1,
              borderRadius: "8px",
            }}
          >
            {status === "loading" ? (
              <Box display="flex" alignItems="center">
                <CircularProgress size={24} color="inherit" sx={{ mr: 1.5 }} />
                Adding User...
              </Box>
            ) : (
              "Add User"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default AddUserForm;
