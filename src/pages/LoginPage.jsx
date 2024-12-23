import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Stack,
  Box,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/styles";

import loginLogo from "../assets/loginLogo.svg";

function LoginPage() {
  const theme = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username && password) {
      navigate("/dashboard");
    } else {
      alert("Please enter valid credentials.");
    }
  };
  return (
    <Stack
      sx={{
        width: "100%",
        height: "100vh",
        minHeight: "500px",
      }}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Stack
        direction={"row"}
        sx={{
          overflow: "hidden",
          backgroundColor: theme.palette.grey.main,
          padding: "10px",
          borderRadius: "15px",
        }}
        gap={"20px"}
      >
        <Stack
          sx={{
            width: "400px",
            height: "500px",
            backgroundColor: "#fff",
            padding: "50px",
            borderRadius: "15px",
          }}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <img src={loginLogo} width={"100%"} />
        </Stack>
        <Stack
          sx={{ width: "400px", height: "500px" }}
          justifyContent={"center"}
        >
          <Typography variant="h4">Login</Typography>
          <Typography>Welcome Back!</Typography>

          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            fullWidth
            style={{ marginTop: "20px" }}
          >
            Login
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default LoginPage;
