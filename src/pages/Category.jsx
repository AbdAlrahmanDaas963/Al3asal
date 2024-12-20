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

import { useDialog } from "../components/common/Dialogs/reuse/DialogContext";
import AddCategoryDialog from "../components/common/Dialogs/reuse/AddCategoryDialog";

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
  {
    id: 7,
    pic: `https://picsum.photos/200?random=${192}`,
    name: "Smartphone Stand",

    details: "High-quality Smartphone Stand with premium features.",
  },
  {
    id: 8,
    pic: `https://picsum.photos/200?random=${492}`,
    name: "Wireless Headphones",

    details: "High-quality Wireless Headphones with premium features.",
  },
  {
    id: 9,
    pic: `https://picsum.photos/200?random=${159}`,
    name: "Bluetooth Speaker",

    details: "High-quality Bluetooth Speaker with premium features.",
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

function Category() {
  const { openDialog, closeDialog, dialog } = useDialog();

  const handleAddCategory = (data) => {
    console.log("Category added:", data);
  };

  return (
    <Stack gap={"30px"}>
      <Button
        onClick={() =>
          openDialog("addCategory", { onSubmit: handleAddCategory })
        }
        sx={{
          width: "100%",
          height: "100px",
          border: "4px dashed #fff",
          fontSize: "20px",
        }}
      >
        Add Category +
      </Button>
      <Stack
        direction={"row"}
        sx={{ width: "100%" }}
        justifyContent={"space-between"}
        gap={"30px"}
      >
        <Typography>Shops</Typography>
        {dialog.type === "addCategory" && (
          <AddCategoryDialog
            open={dialog.open}
            handleClose={closeDialog}
            onSubmit={dialog.props.onSubmit}
          />
        )}
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

export default Category;
