import React from "react";

import {
  Stack,
  Box,
  Typography,
  TextField,
  Switch,
  Divider,
} from "@mui/material";

function MyPaper({ children, sx, ...rest }) {
  return (
    <Stack
      sx={{
        backgroundColor: "#292929",
        borderRadius: "16px",
        padding: "20px",
        color: "white",
        ...sx,
      }}
      {...rest}
    >
      {children}
    </Stack>
  );
}

export default MyPaper;
