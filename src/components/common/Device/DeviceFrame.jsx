import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import frame from "../../../assets/frame.png";

import BackIco from "../../../assets/back.svg";
import CartIco from "../../../assets/icons/cart.svg";
import ArrowRightIco from "../../../assets/icons/ArrowRight.svg";

function DeviceFrame({
  img,
  giftName,
  price,
  location,
  paragraph1,
  paragraph2,
}) {
  console.log(img);

  return (
    <Stack
      sx={{
        position: "relative",
        width: "300px",
        height: "600px",

        overflow: "hidden",
        margin: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Stack
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
        }}
      >
        <img
          src={frame}
          alt="Background"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: "2",
          }}
        />
      </Stack>

      {/* Overlay and Content */}
      <Stack
        sx={{
          position: "absolute",
          width: "95%",
          height: "95%",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "#fff", // Add transparency to the overlay
          display: "flex", // Flex layout for centering content

          color: "white", // Ensure text is visible over the overlay
          borderRadius: "28px",
          overflow: "hidden",
        }}
      >
        <Stack
          direction={"row"}
          sx={{
            padding: "25px 20px 0 20px",
            backgroundColor: "#bbbbf1",
            height: "70px",
          }}
          alignItems={"center"}
          gap={"10px"}
        >
          <img src={BackIco} />
          <Typography sx={{ color: "#000" }}>{giftName}</Typography>
        </Stack>
        {/* BODY */}
        <Stack sx={{ padding: "20px 20px 0px 20px" }}>
          <Stack direction={"row"} gap={"10px"}>
            <Stack>
              <Box
                sx={{
                  width: "100px",
                  height: "100px",
                  color: "#000",
                  borderRadius: "10px",
                  overflow: "hidden",
                  border: img ? "0px " : "3px dashed grey",
                }}
              >
                {img ? (
                  <img
                    src={img}
                    alt="Sample"
                    height={"100%"}
                    style={{
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <Typography>Add me</Typography>
                )}
              </Box>
            </Stack>
            <Stack gap={"3px"} width={"100%"}>
              <Typography sx={{ color: "#000" }} fontWeight={"bold"}>
                {giftName}
              </Typography>
              <Typography sx={{ color: "#000" }}>${price}</Typography>
              <Typography
                sx={{ color: "#000", fontSize: "12px" }}
                fontWeight={"light"}
              >
                {location}
              </Typography>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                width={"100%"}
              >
                <Button
                  variant="contained"
                  size="small"
                  sx={{ borderRadius: "50px", width: "100px" }}
                >
                  Order Now
                </Button>
                <img src={CartIco} />
              </Stack>
            </Stack>
          </Stack>
          <Stack gap={"20px"}>
            <Stack
              maxHeight={"210px"}
              sx={{
                overflow: "hidden",
              }}
            >
              <Typography
                sx={{ color: "#000", fontSize: "12px" }}
                fontWeight={"light"}
              >
                Detailed data
              </Typography>
              <Typography
                sx={{
                  color: "#000",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 4,
                  textOverflow: "ellipsis",
                }}
              >
                {paragraph1}
              </Typography>
              <Typography
                sx={{
                  color: "#000",
                  overflow: "hidden",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 3,
                  textOverflow: "ellipsis",
                  marginTop: "15px",
                }}
              >
                {paragraph2}
              </Typography>
            </Stack>

            <Stack gap={"10px"}>
              <Stack direction={"row"} gap={"10px"} alignItems={"center"}>
                <Typography sx={{ color: "#000", fontWeight: "bold" }}>
                  Similar Gifts
                </Typography>
                <img src={ArrowRightIco} width={"15px"} />
              </Stack>
              <Stack direction={"row"} gap={"10px"}>
                <Box
                  sx={{
                    width: "100px",
                    height: "100px",
                    color: "#000",
                    borderRadius: "10px",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src="https://picsum.photos/250?random=241"
                    alt="Sample"
                    height={"100%"}
                    style={{
                      objectFit: "cover",
                    }}
                  />
                </Box>
                <Stack>
                  <Typography sx={{ color: "#000" }}>Keyboard</Typography>
                  <Typography
                    sx={{ color: "#000", fontSize: "12px" }}
                    fontWeight={"light"}
                  >
                    - Item
                  </Typography>
                  <Typography
                    sx={{ color: "#000", fontSize: "12px" }}
                    fontWeight={"light"}
                  >
                    - Item
                  </Typography>
                  <Typography
                    sx={{ color: "#000", fontSize: "12px" }}
                    fontWeight={"light"}
                  >
                    - Item
                  </Typography>
                  <Typography
                    sx={{ color: "#000", fontSize: "12px" }}
                    fontWeight={"light"}
                  >
                    - Item
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

export default DeviceFrame;
