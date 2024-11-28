import React, { useState } from "react";
import { TextField, Button, Container, Stack, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = () => {
    // For now, we can just navigate directly to the dashboard
    // Add your authentication logic here
    if (username && password) {
      navigate("/dashboard");
    } else {
      alert("Please enter valid credentials.");
    }
  };
  return (
    <Stack
      sx={{ width: "100%", height: "100vh", minHeight: "500px" }}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Stack direction={"row"}>
        <Box
          sx={{ width: "400px", height: "500px", border: "1px solid white" }}
        ></Box>
        <Stack
          sx={{ width: "400px", height: "500px", border: "1px solid white" }}
        >
          <h2>Login</h2>
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
