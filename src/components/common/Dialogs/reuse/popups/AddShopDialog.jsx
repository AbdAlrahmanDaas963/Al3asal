import React, { useState } from "react";
import { TextField, Stack } from "@mui/material";
import DialogWrapper from "../DialogWrapper";
import ImageInput from "../../../ImageInput";

function AddShopDialog({ open, handleClose, onSubmit }) {
  const [productImage, setProductImage] = useState(null);

  const [username, setUsername] = useState("");
  const handleFormSubmit = () => {
    // ? Handle form submit logic here
    onSubmit({ productName: "Sample", price: 100 });
    handleClose();
  };

  return (
    <DialogWrapper open={open} handleClose={handleClose} title="Add Shop">
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
            label="Category Name"
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
            height: "350px",
            backgroundColor: "black",
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <img
            src="https://picsum.photos/250?random=141"
            alt="Sample"
            height={"100%"}
            style={{
              objectFit: "cover",
            }}
          />
        </Stack>
      </Stack>
    </DialogWrapper>
  );
}

export default AddShopDialog;
