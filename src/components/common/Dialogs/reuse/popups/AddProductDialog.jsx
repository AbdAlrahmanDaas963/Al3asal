import React, { useState } from "react";
import { TextField, Stack, Typography } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import DialogWrapper from "../DialogWrapper";

import ImageInput from "../../../ImageInput";

const AddProductDialog = ({ open, handleClose, onSubmit }) => {
  const [productImage, setProductImage] = useState(null);

  const [username, setUsername] = React.useState("");

  const [shop, setShop] = React.useState("");
  const [category, setCategory] = React.useState("");

  const handleChangeShop = (event) => {
    setShop(event.target.value);
  };
  const handleChangeCategory = (event) => {
    setCategory(event.target.value);
  };

  const handleFormSubmit = () => {
    // ? Handle form submit logic here
    onSubmit({ productName: "Sample", price: 100 });
    handleClose();
  };

  return (
    <DialogWrapper open={open} handleClose={handleClose} title="Add Product">
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
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Original Price"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Profit Percentage"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Stack direction={"row"}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Shop</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={shop}
                label="Shop"
                onChange={handleChangeShop}
              >
                <MenuItem value={10}>your</MenuItem>
                <MenuItem value={20}>shop</MenuItem>
                <MenuItem value={30}>select</MenuItem>
                <MenuItem value={30}>wow</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Category</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={category}
                label="Category"
                onChange={handleChangeCategory}
              >
                <MenuItem value={10}>select</MenuItem>
                <MenuItem value={20}>your</MenuItem>
                <MenuItem value={30}>category</MenuItem>
              </Select>
            </FormControl>
          </Stack>
          <ImageInput
            value={productImage ? URL.createObjectURL(productImage) : null}
            onChange={setProductImage}
            onRemove={() => setProductImage(null)}
          />
          <TextField
            id="outlined-multiline-static5"
            label="Detailed data"
            multiline
            rows={4}
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
};

export default AddProductDialog;

{
  /* <DialogWrapper open={open} handleClose={handleClose} title="Add Product">
      <Stack spacing={2}>
        <TextField label="Product Name" fullWidth />
        <TextField label="Price" type="number" fullWidth />
        <button onClick={handleFormSubmit}>Submit</button>
      </Stack>
    </DialogWrapper> */
}
