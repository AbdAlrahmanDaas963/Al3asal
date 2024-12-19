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

import DialogWrapper from "./DialogWrapper";

import { useTheme } from "@emotion/react";

function AddOfferDialog({ open, handleClose, onSubmit }) {
  const theme = useTheme();
  const [username, setUsername] = React.useState("");

  const [shop, setShop] = React.useState("");
  const [category, setCategory] = React.useState("");

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
    <DialogWrapper open={open} handleClose={handleClose} title="Add Offer">
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
              <MenuItem value={10}>your</MenuItem>
              <MenuItem value={20}>shop</MenuItem>
              <MenuItem value={30}>select</MenuItem>
              <MenuItem value={30}>wow</MenuItem>
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
              <MenuItem value={10}>select</MenuItem>
              <MenuItem value={20}>your</MenuItem>
              <MenuItem value={30}>category</MenuItem>
            </Select>
          </FormControl>
          <TextField
            label="Sale percentage"
            variant="outlined"
            fullWidth
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Stack direction="column" spacing={2} alignItems="center">
            <Stack
              direction="row"
              justifyContent={"space-between"}
              sx={{ width: "100%" }}
            >
              <Typography>Upload an Image</Typography>
              <Button
                variant="outlined"
                component="label"
                color={theme.palette.grey.main}
                endIcon={<AddPhotoAlternateIcon />}
              >
                Choose File
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Button>
            </Stack>

            {selectedImage && (
              <Box
                sx={{
                  width: 150,
                  height: 150,
                  border: "1px solid #ccc",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <Avatar
                  src={selectedImage}
                  variant="square"
                  sx={{ width: "100%", height: "100%" }}
                  alt="Uploaded Image"
                />
              </Box>
            )}

            {selectedImage && (
              <Button
                variant="outlined"
                color="error"
                onClick={handleRemoveImage}
              >
                Remove Image
              </Button>
            )}
          </Stack>
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

export default AddOfferDialog;

{
  /* <Stack spacing={2}>
        <TextField label="Offer Name" fullWidth />
        <TextField label="Price" type="number" fullWidth />
        <button onClick={handleFormSubmit}>Submit</button>
      </Stack> */
}
