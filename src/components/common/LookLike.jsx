import React from "react";
import { Box, Button, Stack, Typography } from "@mui/material";

import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import EastIcon from "@mui/icons-material/East";

function LookLike() {
  // console.log(<ArrowBackIosNewIcon htmlColor="black" />);

  return (
    <Stack
      sx={{
        border: "10px solid grey",
        width: "330px",
        height: "540px",
        background: "#aaa",
        color: "#000",
        borderRadius: "20px",
      }}
    >
      <Stack direction={"row"} sx={{ padding: "15px 20px" }}>
        <ArrowBackIosNewIcon />
        <Typography sx={{ color: "#000" }}>Gift Name</Typography>
      </Stack>
      <Stack sx={{ padding: "0px 20px 0px 20px" }}>
        <Stack direction={"row"}>
          <Stack>
            <Box
              sx={{
                width: "150px",
                height: "150px",
                border: "1px solid black",
                color: "#000",
              }}
            >
              img
            </Box>
          </Stack>
          <Stack>
            <Typography sx={{ color: "#000" }}>Gift name goes here</Typography>
            <Typography sx={{ color: "#000" }}>$33</Typography>
            <Button>Order Now</Button>
          </Stack>
        </Stack>
        <Stack>
          <Typography sx={{ color: "#000" }}>Detailed data</Typography>
          <Typography sx={{ color: "#000" }}>
            Lorem ipsum dolor sit amet,Lorem ipsum dolor sit amet,Lorem ipsum
            dolor sit amet,Lorem ipsum dolor sit amet
          </Typography>
          <Typography sx={{ color: "#000" }}>Similar Gifts</Typography>
          <Stack direction={"row"}>
            <Box
              sx={{
                width: "150px",
                height: "150px",
                border: "1px solid black",
              }}
            >
              img
            </Box>
            <Typography sx={{ color: "#000" }}>
              Gift name and suggestion
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default LookLike;
