import React from "react";
import DialogWrapper from "./reuse/DialogWrapper";

const ConfirmationDialog = ({ open, handleClose, onConfirm, message }) => {
  return (
    <DialogWrapper open={open} handleClose={handleClose} title="Confirm Action">
      <p>{message}</p>
      <button onClick={onConfirm}>Confirm</button>
    </DialogWrapper>
  );
};

export default ConfirmationDialog;
