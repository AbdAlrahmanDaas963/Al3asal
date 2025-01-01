import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import BackIco from "../../../assets/back.svg";
import CartIco from "../../../assets/icons/cart.svg";

function DeviceOfferContent({
  img,
  giftName,
  price,
  location,
  shop,
  category,
  sale,
}) {
  return (
    <>
      {/* Header */}
      <Stack
        direction="row"
        sx={{
          padding: "25px 20px 0 20px",
          backgroundColor: "#bbbbf1",
          height: "70px",
        }}
        alignItems="center"
        gap="10px"
      >
        <img src={BackIco} alt="Back" />
        <Typography sx={{ color: "#000" }}>{giftName}</Typography>
      </Stack>

      {/* Body */}
      <Stack sx={{ padding: "20px" }} gap={2}>
        <Stack direction="row" gap={2}>
          {/* Image */}
          <Box
            sx={{
              width: "100px",
              height: "100px",
              borderRadius: "10px",
              overflow: "hidden",
              border: img ? "none" : "3px dashed grey",
            }}
          >
            {img ? (
              <img
                src={img}
                alt="Product"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <Typography>Add me</Typography>
            )}
          </Box>

          {/* Details */}
          <Stack gap={1}>
            <Typography fontWeight="bold">{giftName}</Typography>
            <Typography>${price}</Typography>
            <Typography fontSize="12px" fontWeight="light">
              {location}
            </Typography>
            <Button
              variant="contained"
              size="small"
              sx={{ borderRadius: "50px" }}
            >
              Order Now
            </Button>
          </Stack>
        </Stack>

        {/* Paragraphs */}
        <Typography fontSize="16px" sx={{ color: "#000" }}>
          Offer: {shop}
        </Typography>
        <Typography fontSize="16px" sx={{ color: "#000" }}>
          Category: {category}
        </Typography>
        <Typography fontSize="16px" sx={{ color: "#000" }}>
          Sale: {sale}
        </Typography>
      </Stack>
    </>
  );
}

export default DeviceOfferContent;
