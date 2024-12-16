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
import AddProductDialog from "../components/common/Dialogs/reuse/AddProductDialog";
import ConfirmationDialog from "../components/common/Dialogs/ConfirmationDialog";

const dummy = [
  {
    id: 1,
    pic: `https://picsum.photos/150?random=${10}`,
    name: "Mechanical Keyboard",
    price: 173.14,
    profit_percentage: 23.38,
    category: "Audio",
    original_price: 140.33,
    details: "High-quality Mechanical Keyboard with premium features.",
  },
  {
    id: 2,
    pic: `https://picsum.photos/150?random=${32}`,
    name: "Smartwatch",
    price: 86.57,
    profit_percentage: 47.68,
    category: "Accessories",
    original_price: 58.62,
    details: "High-quality Smartwatch with premium features.",
  },
  {
    id: 3,
    pic: `https://picsum.photos/150?random=${15}`,
    name: "Mechanical Keyboard",
    price: 164.63,
    profit_percentage: 17.35,
    category: "Office",
    original_price: 140.29,
    details: "High-quality Mechanical Keyboard with premium features.",
  },
  {
    id: 4,
    pic: `https://picsum.photos/150?random=${121}`,
    name: "Wireless Headphones",
    price: 81.92,
    profit_percentage: 23.75,
    category: "Accessories",
    original_price: 66.2,
    details: "High-quality Wireless Headphones with premium features.",
  },
  {
    id: 5,
    pic: `https://picsum.photos/150?random=${532}`,
    name: "Smartphone Stand",
    price: 49.97,
    profit_percentage: 15.6,
    category: "Audio",
    original_price: 43.23,
    details: "High-quality Smartphone Stand with premium features.",
  },
  {
    id: 6,
    pic: `https://picsum.photos/150?random=${412}`,
    name: "Noise Cancelling Earbuds",
    price: 58.17,
    profit_percentage: 46.97,
    category: "Office",
    original_price: 39.58,
    details: "High-quality Noise Cancelling Earbuds with premium features.",
  },
  {
    id: 7,
    pic: `https://picsum.photos/150?random=${132}`,
    name: "Smartphone Stand",
    price: 95.3,
    profit_percentage: 31.49,
    category: "Electronics",
    original_price: 72.48,
    details: "High-quality Smartphone Stand with premium features.",
  },
  {
    id: 8,
    pic: `https://picsum.photos/150?random=${112}`,
    name: "Wireless Headphones",
    price: 112.07,
    profit_percentage: 45.6,
    category: "Gaming",
    original_price: 76.97,
    details: "High-quality Wireless Headphones with premium features.",
  },
  {
    id: 9,
    pic: `https://picsum.photos/150?random=${152}`,
    name: "Bluetooth Speaker",
    price: 100.53,
    profit_percentage: 43.74,
    category: "Electronics",
    original_price: 69.94,
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
          <Typography>Price:</Typography>
          <Typography>Profit percentage:</Typography>
          <Typography>Category:</Typography>
        </Stack>
        <Stack alignItems={"flex-end"}>
          <Typography>{name}</Typography>
          <Typography>{price}</Typography>
          <Typography>{profit_percentage}</Typography>
          <Typography>{category}</Typography>
        </Stack>
      </Stack>
      <Stack>
        <Button>Edit</Button>
      </Stack>
    </Stack>
  );
}

function Products() {
  const { openDialog, closeDialog, dialog } = useDialog();

  const handleAddProduct = (data) => {
    console.log("Product added:", data);
  };

  const handleConfirm = () => {
    console.log("Confirmed action!");
    closeDialog();
  };
  // const [open, setOpen] = useState(false);

  // const handleOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };

  // const handleAgree = () => {
  //   // Custom logic for the "Agree" button
  //   console.log("Agreed!");
  //   handleClose();
  // };

  // const handleDisagree = () => {
  //   // Custom logic for the "Disagree" button
  //   console.log("Disagreed!");
  //   handleClose();
  // };

  return (
    <Stack>
      <div>
        <button
          onClick={() =>
            openDialog("addProduct", { onSubmit: handleAddProduct })
          }
        >
          Add Product
        </button>
        <button
          onClick={() =>
            openDialog("confirmation", {
              message: "Are you sure you want to delete this?",
              onConfirm: handleConfirm,
            })
          }
        >
          Delete Item
        </button>

        {/* Render Dialogs */}
        {dialog.type === "addProduct" && (
          <AddProductDialog
            open={dialog.open}
            handleClose={closeDialog}
            onSubmit={dialog.props.onSubmit}
          />
        )}
        {dialog.type === "confirmation" && (
          <ConfirmationDialog
            open={dialog.open}
            handleClose={closeDialog}
            message={dialog.props.message}
            onConfirm={dialog.props.onConfirm}
          />
        )}
      </div>
      {/* <Stack>
        <Button sx={{ border: "3px dotted grey" }} onClick={handleOpen}>
          + Add Product
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
      </Stack> */}
      <Stack
        direction={"row"}
        sx={{ width: "100%" }}
        justifyContent={"space-between"}
      >
        <Typography>Products</Typography>
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

export default Products;
