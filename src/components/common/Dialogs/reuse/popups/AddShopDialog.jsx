import React, { useState } from "react";
import { TextField, Stack } from "@mui/material";
import DialogWrapper from "../DialogWrapper";
import ImageInput from "../../../ImageInput";
import DeviceShopContent from "../../../Device/DeviceShopContent";
import DeviceFrameProvider from "../../../Device/DeviceFrameProvider";

function AddShopDialog({ open, handleClose, onSubmit }) {
  const [productImage, setProductImage] = useState(null);

  const [username, setUsername] = useState("");
  const handleFormSubmit = () => {
    // ? Handle form submit logic here
    onSubmit({ productName: "Sample", price: 100 });
    handleClose();
  };

  return (
    <DialogWrapper
      fullScreen
      open={open}
      handleClose={handleClose}
      title="Add Shop"
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={"10px"}
        sx={{
          height: "fit-content",
        }}
      >
        <Stack sx={{ width: "100%" }}>
          <TextField
            label="Shop Name"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <ImageInput
            value={productImage ? URL.createObjectURL(productImage) : null}
            onChange={setProductImage}
            onRemove={() => setProductImage(null)}
          />
        </Stack>
        <Stack
          sx={{
            width: "100%",
          }}
        >
          <DeviceFrameProvider>
            <DeviceShopContent />
          </DeviceFrameProvider>
        </Stack>
      </Stack>
    </DialogWrapper>
  );
}

export default AddShopDialog;
