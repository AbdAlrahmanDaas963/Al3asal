import React, { useState } from "react";
import {
  Button,
  Stack,
  Typography,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import AddProductDialog from "../components/AddProductDialog";

const dummy = [
  {
    id: 1,
    pic: `https://picsum.photos/200?random=${190}`,
    name: "Mechanical Keyboard",

    details: "High-quality Mechanical Keyboard with premium features.",
  },
  {
    id: 2,
    pic: `https://picsum.photos/200?random=${392}`,
    name: "Smartwatch",

    details: "High-quality Smartwatch with premium features.",
  },
  {
    id: 3,
    pic: `https://picsum.photos/200?random=${195}`,
    name: "Mechanical Keyboard",

    details: "High-quality Mechanical Keyboard with premium features.",
  },
  {
    id: 4,
    pic: `https://picsum.photos/200?random=${129}`,
    name: "Wireless Headphones",

    details: "High-quality Wireless Headphones with premium features.",
  },
  {
    id: 5,
    pic: `https://picsum.photos/200?random=${592}`,
    name: "Smartphone Stand",

    details: "High-quality Smartphone Stand with premium features.",
  },
  {
    id: 6,
    pic: `https://picsum.photos/200?random=${492}`,
    name: "Noise Cancelling Earbuds",

    details: "High-quality Noise Cancelling Earbuds with premium features.",
  },
];

function ProductCard({ item }) {
  const { name, price, profit_percentage, category, pic } = item;
  return (
    <Stack
      sx={{
        width: "300px",
        // height: "300px",
        border: "1px dotted grey",
        padding: "6px",
        borderRadius: "20px",
      }}
    >
      <img
        src={pic}
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
          borderRadius: "16px",
          backgroundColor: "grey",
        }}
        alt="picture"
      />
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Stack>
          <Typography>Product Name:</Typography>
        </Stack>
        <Stack alignItems={"flex-end"}>
          <Typography>{name}</Typography>
        </Stack>
      </Stack>
      <Stack>
        <Button>Edit</Button>
      </Stack>
    </Stack>
  );
}

function Shops() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAgree = () => {
    // Custom logic for the "Agree" button
    console.log("Agreed!");
    handleClose();
  };

  const handleDisagree = () => {
    // Custom logic for the "Disagree" button
    console.log("Disagreed!");
    handleClose();
  };
  return (
    <Stack>
      <Stack>
        <Button sx={{ border: "3px dotted blue" }} onClick={handleOpen}>
          + Add Shop
        </Button>
        <AddProductDialog
          open={open}
          handleClose={handleClose}
          title="Use Google's location service?"
          content="Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running."
          agreeLabel="Agree"
          disagreeLabel="Disagree"
          onAgree={handleAgree}
          onDisagree={handleDisagree}
        />
      </Stack>
      <Stack
        direction={"row"}
        sx={{ width: "100%" }}
        justifyContent={"space-between"}
      >
        <Typography>Shops</Typography>
        {/* <Typography>Search</Typography> */}
        <TextField
          variant="outlined"
          placeholder="Search..."
          fullWidth
          sx={{
            width: "300px", // Customize the width as needed
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Stack direction={"row"} flexWrap={"wrap"} gap={"10px"}>
        {dummy.map((item, index) => (
          <ProductCard key={index} item={item} />
        ))}
      </Stack>
    </Stack>
  );
}

export default Shops;
