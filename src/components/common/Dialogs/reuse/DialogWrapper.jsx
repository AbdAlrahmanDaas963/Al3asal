// ? reusable UI
import React from "react";
import Dialog from "@mui/material/Dialog";
import Slide from "@mui/material/Slide";
import { Typography, Stack, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogWrapper = ({ open, handleClose, title, children }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <Stack p={3} spacing={2}>
        {/* Header with Title and Close Button */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
        {/* Dialog Content */}
        {children}
        {/* Footer */}
        <Stack direction="row" justifyContent="flex-end" spacing={2}>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default DialogWrapper;
