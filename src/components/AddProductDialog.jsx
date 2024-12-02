import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { Box, Stack, Typography, TextField } from "@mui/material";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function AddProductDialog({
  open,
  handleClose,
  title,
  content,
  agreeLabel = "Agree",
  disagreeLabel = "Disagree",
  onAgree,
  onDisagree,
}) {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="slide-dialog-description"
    >
      <Stack sx={{ padding: "20px" }} gap={"20px"}>
        <Stack direction={"row"} justifyContent={"space-between"}>
          <Typography>Add Product</Typography>
          <Button onClick={handleClose}>close</Button>
        </Stack>
        <Stack direction={"row"} gap={"20px"}>
          <Stack spacing={2}>
            <TextField
              id="outlined-basic-1"
              label="Input 1"
              variant="outlined"
              sx={{
                height: "50px",
                width: "250px",
              }}
            />
            <TextField
              id="outlined-basic-2"
              label="Input 2"
              variant="outlined"
              sx={{
                height: "50px",
                width: "250px",
              }}
            />
            <TextField
              id="outlined-basic-3"
              label="Input 3"
              variant="outlined"
              sx={{
                height: "50px",
                width: "250px",
              }}
            />
            <TextField
              id="outlined-basic-4"
              label="Input 4"
              variant="outlined"
              sx={{
                height: "50px",
                width: "250px",
              }}
            />
            <TextField
              id="outlined-basic-5"
              label="Input 5"
              variant="outlined"
              sx={{
                height: "50px",
                width: "250px",
              }}
            />
          </Stack>
          <Stack>
            <img
              style={{
                border: "1px dotted grey",
                objectFit: "cover",
                width: "200px",
                height: "500px",
                borderRadius: "20px",
              }}
              src="https://via.placeholder.com/150?text=Product+To+Add"
            />
          </Stack>
        </Stack>
      </Stack>
      {/* <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="slide-dialog-description">
          {content}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDisagree || handleClose}>{disagreeLabel}</Button>
        <Button onClick={onAgree || handleClose}>{agreeLabel}</Button>
      </DialogActions> */}
    </Dialog>
  );
}

export default AddProductDialog;
