import React from "react";

import { TextField } from "@mui/material";

function MyTextField({ label, type }) {
  return (
    <TextField
      type={type}
      id="outlined-basic"
      label={label}
      variant="outlined"
      sx={{
        "& .MuiOutlinedInput-root": {
          color: "white",
          "& fieldset": {
            borderColor: "white",
          },
          "&:hover fieldset": {
            borderColor: "white",
          },
          "&.Mui-focused fieldset": {
            borderColor: "white",
          },
        },
        "& .MuiInputLabel-root": {
          color: "white",
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "white",
        },
      }}
    />
  );
}

export default MyTextField;
