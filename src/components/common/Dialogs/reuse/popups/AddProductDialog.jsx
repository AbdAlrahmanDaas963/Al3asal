import React, { useState } from "react";
import { TextField, Stack } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import DialogWrapper from "../DialogWrapper";
import ImageInput from "../../../ImageInput";
import DeviceFrame from "../../../DeviceFrame";

const AddProductDialog = ({ open, handleClose, onSubmit }) => {
  const [productImage, setProductImage] = useState(null);
  const [giftName, setGiftName] = useState("Holiday Special Gift");
  const [originalPrice, setOriginalPrice] = useState("50");
  const [profitPercentage, setProfitPercentage] = useState("20");
  const [shop, setShop] = useState("10");
  const [category, setCategory] = useState("20");
  const [detailedData, setDetailedData] = useState(
    "This is a high-quality, unique gift perfect for any occasion."
  );

  const handleFormSubmit = () => {
    const calculatedPrice = (
      parseFloat(originalPrice) +
      (parseFloat(originalPrice) * parseFloat(profitPercentage)) / 100
    ).toFixed(2);

    onSubmit({
      giftName,
      originalPrice,
      profitPercentage,
      shop,
      category,
      productImage,
      detailedData,
      calculatedPrice,
    });

    handleClose();
  };

  return (
    <DialogWrapper
      fullScreen={true}
      open={open}
      handleClose={handleClose}
      title="Add Product"
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
            label="Gift Name"
            variant="outlined"
            fullWidth
            value={giftName}
            onChange={(e) => setGiftName(e.target.value)}
          />
          <TextField
            label="Original Price"
            variant="outlined"
            fullWidth
            value={originalPrice}
            onChange={(e) => setOriginalPrice(e.target.value)}
          />
          <TextField
            label="Profit Percentage"
            variant="outlined"
            fullWidth
            value={profitPercentage}
            onChange={(e) => setProfitPercentage(e.target.value)}
          />
          <Stack direction={"row"} gap={2}>
            <FormControl fullWidth>
              <InputLabel id="shop-select-label">Shop</InputLabel>
              <Select
                labelId="shop-select-label"
                value={shop}
                onChange={(e) => setShop(e.target.value)}
              >
                <MenuItem value="10">Shop A</MenuItem>
                <MenuItem value="20">Shop B</MenuItem>
                <MenuItem value="30">Shop C</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <MenuItem value="10">Electronics</MenuItem>
                <MenuItem value="20">Fashion</MenuItem>
                <MenuItem value="30">Home Decor</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <ImageInput
            value={productImage ? URL.createObjectURL(productImage) : null}
            onChange={setProductImage}
            onRemove={() => setProductImage(null)}
          />
          <TextField
            label="Detailed Data"
            multiline
            rows={4}
            fullWidth
            value={detailedData}
            onChange={(e) => setDetailedData(e.target.value)}
          />
        </Stack>
        <Stack sx={{ width: "100%" }}>
          <DeviceFrame
            giftName={giftName}
            location={shop}
            paragraph1={detailedData}
            paragraph2={`Category: ${category}`}
            price={`${(
              parseFloat(originalPrice) +
              (parseFloat(originalPrice) * parseFloat(profitPercentage)) / 100
            ).toFixed(2)}`}
          />
        </Stack>
      </Stack>
    </DialogWrapper>
  );
};

export default AddProductDialog;
