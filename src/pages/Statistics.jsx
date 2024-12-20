import React from "react";

import { Box, Stack, Typography } from "@mui/material";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import MyGridChart from "../components/MyGridChart";
import MyBarChart from "../components/MyBarChart";

const dumm = [
  { title: "Man" },
  { title: "Women" },
  { title: "Flowers" },
  { title: "Electronics" },
  { title: "Bags" },
  { title: "Shoes" },
];

const sales = [
  { title: "Screen" },
  { title: "Mobile" },
  { title: "Shampoo" },
  { title: "Watch" },
  { title: "Ball" },
  { title: "Mouse" },
  { title: "Headphones" },
];

const ProductCard = ({ title }) => {
  const theme = useTheme();
  return (
    <Stack
      sx={{
        width: "350px",
        height: "fit-content",
        backgroundColor: theme.palette.grey.main,
        borderRadius: "15px",
        padding: "7px",
      }}
      alignItems={"center"}
      justifyContent={"space-between"}
      gap={"7px"}
    >
      <img
        src={"https://picsum.photos/150?random=69"}
        style={{
          width: "100%",
          height: "150px",
          objectFit: "cover",
          borderRadius: "16px",
          backgroundColor: "grey",
        }}
      />
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        width={"100%"}
      >
        <Typography>Product Name :</Typography>
        <Typography>{title}</Typography>
      </Stack>
    </Stack>
  );
};
const ShopCard = ({ title }) => {
  const theme = useTheme();
  return (
    <Stack
      sx={{
        width: "250px",
        height: "fit-content",
        backgroundColor: theme.palette.grey.main,
        borderRadius: "15px",
        padding: "7px",
      }}
      alignItems={"center"}
      justifyContent={"space-between"}
      gap={"7px"}
    >
      <img
        src={"https://picsum.photos/150?random=68"}
        style={{
          width: "100%",
          height: "250px",
          objectFit: "cover",
          borderRadius: "16px",
          backgroundColor: "grey",
        }}
      />
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        width={"100%"}
      >
        <Typography>Shop Name :</Typography>
        <Typography>{title}</Typography>
      </Stack>
    </Stack>
  );
};

function Statistics() {
  const theme = useTheme();
  return (
    <Stack>
      <Stack direction={"column"} alignItems={"flex-start"} gap={"30px"}>
        <Stack direction={"row"} gap={"30px"}>
          <Box sx={{ border: "0px solid grey" }}>
            <MyGridChart />
          </Box>
          <Box sx={{ border: "0px solid grey" }}>
            <MyBarChart />
          </Box>
          <Stack
            direction={"column"}
            sx={{
              width: "200px",
              height: "200px",
              backgroundColor: theme.palette.grey.main,
              borderRadius: "15px",
              padding: "15px",
            }}
            alignItems={"center"}
            justifyContent={"center"}
            gap={"5px"}
          >
            {dumm.map((item, index) => (
              <Stack key={index} sx={{ width: "100%" }}>
                <Stack direction={"row"} gap={"10px"}>
                  <Typography
                    sx={{
                      color:
                        index === 0
                          ? theme.palette.red.main
                          : index === 1 || index === 2
                            ? "#81BCE0"
                            : "inherit",
                    }}
                  >
                    #{index + 1}
                  </Typography>
                  <Typography>{item.title}</Typography>
                </Stack>
                {index < dumm.length - 1 && (
                  <Divider variant="fullWidth" sx={{ width: "100%" }} />
                )}
              </Stack>
            ))}
          </Stack>
        </Stack>
        <Stack sx={{ overflowX: "auto" }} direction={"row"} gap={"20px"}>
          {sales.map((item, index) => (
            <ProductCard key={index} title={item.title}></ProductCard>
          ))}
        </Stack>
        <Stack sx={{ overflowX: "auto" }} direction={"row"} gap={"20px"}>
          {sales.map((item, index) => (
            <ShopCard key={index} title={item.title}></ShopCard>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Statistics;
