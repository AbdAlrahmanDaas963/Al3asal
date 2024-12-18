import React from "react";
import { TextField, Stack } from "@mui/material";
import DialogWrapper from "./DialogWrapper";

function AddCategoryDialog({ open, handleClose, onSubmit }) {
  const handleFormSubmit = () => {
    // ? Handle form submit logic here
    onSubmit({ CategoryName: "Sample", price: 100 });
    handleClose();
  };

  return (
    <DialogWrapper open={open} handleClose={handleClose} title="Add Category">
      <Stack spacing={2}>
        <TextField label="Category Name" fullWidth />
        <TextField label="Price" type="number" fullWidth />
        <button onClick={handleFormSubmit}>Submit</button>
      </Stack>
    </DialogWrapper>
  );
}

export default AddCategoryDialog;
