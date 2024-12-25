import React, { useState } from "react";
import {
  TextField,
  Stack,
  Typography,
  Box,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";

import PremuimIcon from "../../../../../assets/premuim.svg";

import DialogWrapper from "../DialogWrapper";

import ImageInput from "../../../ImageInput";
import { useTheme } from "@mui/styles";

const statuses = [
  { label: "Preparing", color: "#FFA726" }, // Orange
  { label: "Shipped", color: "#29B6F6" }, // Blue
  { label: "Delivered", color: "#66BB6A" }, // Green
  { label: "Cancelled", color: "#EF5350" }, // Red
];

const details = {
  customerName: "John Doe",
  receiverName: "Jane Smith",
  id: "12345",
  card: "VISA - 5261 8494 0897 1834",
  location: "New York, NY",
  status: "Delivered",
  customerNumber: "+1 234 567 8901",
  receiverNumber: "+1 987 654 3210",
  deliveryDate: "2024-12-30",
  payment: "$150.00",
  category: "Electronics",
};

const StatusDropdown = () => {
  const [status, setStatus] = useState(statuses[0]);

  const handleChange = (event) => {
    const selectedStatus = statuses.find((s) => s.label === event.target.value);
    setStatus(selectedStatus);
  };

  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Typography variant="body1" sx={{ fontWeight: "bold" }}>
        Status:
      </Typography>
      <Select
        value={status.label}
        onChange={handleChange}
        size="small"
        renderValue={(value) => (
          <Box display="flex" alignItems="center" gap={1}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: status.color,
              }}
            />
            <Typography variant="body2">{value}</Typography>
          </Box>
        )}
        sx={{
          minWidth: 150,
          border: "none", // Removes the border
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none", // Ensures no outline appears
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            border: "none", // Keeps hover consistent
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "none", // No border when focused
          },
        }}
      >
        {statuses.map((s) => (
          <MenuItem key={s.label} value={s.label}>
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: s.color,
                }}
              />
              <Typography variant="body2">{s.label}</Typography>
            </Box>
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
};

const KeyValue = ({ thekey, value }) => {
  return (
    <Stack gap={"10px"} direction={"row"}>
      <Typography>{thekey}:</Typography>
      <Typography>{value}</Typography>
    </Stack>
  );
};
const GiftCard = () => {
  const theme = useTheme();
  return (
    <Stack
      direction={"row"}
      sx={{
        backgroundColor: theme.palette.grey.main,
        padding: "8px",
        width: "350px",
        borderRadius: "15px",
      }}
    >
      <Box sx={{ width: "150px", height: "150px" }}>
        <img
          src="https://picsum.photos/250?random=141"
          alt="Sample"
          height={"150px"}
          style={{
            objectFit: "cover",
            borderRadius: "13px",
          }}
        />
      </Box>
      <Stack
        direction={"column"}
        sx={{ width: "100%", padding: "8px" }}
        justifyContent={"space-between"}
      >
        <Stack>
          <Typography>Gift name</Typography>
          <Stack direction={"row"} gap={"5px"}>
            <Typography>Amount: </Typography>
            <Typography>21</Typography>
          </Stack>
        </Stack>
        <Stack alignItems={"flex-end"}>
          <Typography>$33</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

function ShowRowDetails({ open, handleClose, onSubmit, data }) {
  console.log("data", data);
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
    <DialogWrapper
      open={open}
      handleClose={handleClose}
      title={data.customerName}
    >
      <Stack
        alignItems={"center"}
        justifyContent={"center"}
        gap={"10px"}
        sx={{
          height: "fit-content",
        }}
      >
        <Stack sx={{ border: "1px solid black" }}>
          <Typography variant="h5">Products</Typography>
          <Stack
            flexWrap={"wrap"}
            gap={"10px"}
            sx={{ border: "1px solid red" }}
            direction={"row"}
          >
            <GiftCard />
            <GiftCard />
            <GiftCard />
          </Stack>
        </Stack>
        <Stack sx={{ border: "1px solid black", width: "100%" }}>
          <Typography variant="h5">Order Details</Typography>
          <Stack direction={"row"} gap={"50px"}>
            <Stack gap={"10px"}>
              <KeyValue thekey={"Customer Name"} value={data.customerName} />
              <KeyValue thekey={"Receiver Name"} value={details.receiverName} />
              <KeyValue thekey={"ID"} value={details.id} />
              <KeyValue thekey={"Card"} value={details.card} />
              <KeyValue thekey={"Location"} value={details.location} />
              <StatusDropdown />
            </Stack>
            <Stack gap={"10px"}>
              <KeyValue
                thekey={"Customer Number"}
                value={details.customerNumber}
              />
              <KeyValue
                thekey={"Receiver Number"}
                value={details.receiverNumber}
              />
              <KeyValue thekey={"Delivery Date"} value={details.deliveryDate} />
              <KeyValue thekey={"Payment"} value={details.payment} />
              <KeyValue thekey={"Category"} value={details.category} />
            </Stack>
          </Stack>
        </Stack>
        <Stack sx={{ border: "1px solid black", width: "100%" }}>
          <Stack direction={"row"} gap={"10px"}>
            <img src={PremuimIcon} width={"30px"} />
            <Typography variant="h5">Premium Service</Typography>
          </Stack>

          <Stack direction={"column"}>
            <Typography>Customer Name</Typography>
            <KeyValue thekey={"Delivery Date"} value={details.deliveryDate} />
            <Stack>
              <Typography>Files:</Typography>
              <Stack direction={"row"} gap={"10px"}>
                <Box
                  sx={{
                    width: "100px",
                    height: "100px",
                    backgroundColor: "grey",
                    borderRadius: "10px",
                  }}
                ></Box>
                <Box
                  sx={{
                    width: "100px",
                    height: "100px",
                    backgroundColor: "grey",
                    borderRadius: "10px",
                  }}
                ></Box>
                <Box
                  sx={{
                    width: "100px",
                    height: "100px",
                    backgroundColor: "grey",
                    borderRadius: "10px",
                  }}
                ></Box>
              </Stack>
            </Stack>
            <Stack>
              <Typography>Notes:</Typography>
              <TextField
                id="outlined-multiline-static"
                multiline
                rows={4}
                defaultValue="..."
              />
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </DialogWrapper>
  );
}

export default ShowRowDetails;
