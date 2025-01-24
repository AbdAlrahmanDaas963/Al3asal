import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Alert,
} from "@mui/material";

import { addUser } from "../Auth/userSlice";

const AddUserForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    is_admin: "1",
  });
  const dispatch = useDispatch();
  const { status, error } = useSelector((state) => state.users);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addUser(formData));
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
        Add New User
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ mt: 2, width: "400px" }}
      >
        <TextField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          fullWidth
          margin="normal"
          required
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
        >
          <MenuItem value="1">Admin</MenuItem>
          <MenuItem value="0">Employee</MenuItem>
        </TextField>
        {status === "failed" && (
          <Alert severity="error">
            {error?.message || "Failed to add user"}
          </Alert>
        )}
        {status === "succeeded" && (
          <Alert severity="success">User added successfully!</Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Adding..." : "Add User"}
        </Button>
      </Box>
    </Box>
  );
};

export default AddUserForm;
