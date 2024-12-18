import React from "react";
import { TextField, Stack } from "@mui/material";
import DialogWrapper from "./DialogWrapper";

function AddOfferDialog({ open, handleClose, onSubmit }) {
  const handleFormSubmit = () => {
    // ? Handle form submit logic here
    onSubmit({ offerName: "Sample", price: 100 });
    handleClose();
  };

  return (
    <DialogWrapper open={open} handleClose={handleClose} title="Add Offer">
      <Stack spacing={2}>
        <TextField label="Offer Name" fullWidth />
        <TextField label="Price" type="number" fullWidth />
        <button onClick={handleFormSubmit}>Submit</button>
      </Stack>
    </DialogWrapper>
  );
}

export default AddOfferDialog;
