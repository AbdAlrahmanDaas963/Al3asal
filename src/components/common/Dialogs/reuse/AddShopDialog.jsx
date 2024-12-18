import React from "react";
import { TextField, Stack } from "@mui/material";
import DialogWrapper from "./DialogWrapper";

function AddShopDialog({ open, handleClose, onSubmit }) {
  const handleFormSubmit = () => {
    // ? Handle form submit logic here
    onSubmit({ productName: "Sample", price: 100 });
    handleClose();
  };

  return (
    <DialogWrapper open={open} handleClose={handleClose} title="Add Shop">
      <Stack spacing={2}>
        <TextField label="Shop Name" fullWidth />
        <TextField label="Price" type="number" fullWidth />
        <button onClick={handleFormSubmit}>Submit</button>
      </Stack>
    </DialogWrapper>
  );
}

export default AddShopDialog;
