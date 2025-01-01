import React, { useState } from "react";
import {
  TextField,
  Stack,
  Avatar,
  Button,
  Typography,
  Box,
} from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

import DialogWrapper from "../DialogWrapper";

import DeviceFrame from "../../../Device/DeviceFrame";

import DeviceFrameProvider from "../../../Device/DeviceFrameProvider";
import DeviceOfferContent from "../../../Device/DeviceOfferContent";

import { useTheme } from "@emotion/react";
import ImageInput from "../../../ImageInput";

function AddOfferDialog({ open, handleClose, onSubmit }) {
  const [productImage, setProductImage] = useState(null);
  const [category, setCategory] = useState("");
  const [shop, setShop] = useState("");
  const [sale, setSale] = useState("");

  const theme = useTheme();

  const handleChangeShop = (event) => {
    setShop(event.target.value);
  };
  const handleChangeCategory = (event) => {
    setCategory(event.target.value);
  };

  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const handleFormSubmit = () => {
    // ? Handle form submit logic here
    onSubmit({ offerName: "Sample", price: 100 });
    handleClose();
  };

  return (
    <DialogWrapper
      fullScreen
      open={open}
      handleClose={handleClose}
      title="Add Offer"
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
        <Stack sx={{ width: "100%" }} gap={"10px"}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Shop Name</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={shop}
              label="Shop"
              onChange={handleChangeShop}
            >
              <MenuItem value={"Shop 1"}>Shop 1</MenuItem>
              <MenuItem value={"Shop 2"}>Shop 2</MenuItem>
              <MenuItem value={"Shop 3"}>Shop 3</MenuItem>
              <MenuItem value={"Shop 4"}>Shop 4</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Category Name</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category}
              label="Category"
              onChange={handleChangeCategory}
            >
              <MenuItem value={"Category 1"}>Category 1</MenuItem>
              <MenuItem value={"Category 2"}>Category 2</MenuItem>
              <MenuItem value={"Category 3"}>Category 3</MenuItem>
              <MenuItem value={"Category 4"}>Category 4</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Sale percentage"
            variant="outlined"
            fullWidth
            value={sale}
            onChange={(e) => setSale(e.target.value)}
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
            <DeviceOfferContent
              giftName="Holiday Gift"
              price="20.00"
              location="Shop A"
              paragraph1="This is a great gift for the holidays."
              paragraph2="Category: Holiday Items"
              shop={shop}
              category={category}
              sale={sale}
              img={productImage ? URL.createObjectURL(productImage) : null}
            />
          </DeviceFrameProvider>
        </Stack>
      </Stack>
    </DialogWrapper>
  );
}

export default AddOfferDialog;
