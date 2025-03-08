import React from "react";
import { useDispatch } from "react-redux";
import { Button, Stack, Typography } from "@mui/material";
import { logOut } from "../../features/Auth/authSlice";

function LogOutButton() {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logOut());
  };

  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={handleLogout}
      sx={{
        textTransform: "none",
        backgroundColor: "#E4272B",
        "&:hover": {
          backgroundColor: "#cc2227",
        },
      }}
    >
      Logout
    </Button>
  );
}

export default LogOutButton;
