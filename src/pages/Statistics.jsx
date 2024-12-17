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

const CardSale = ({ title }) => {
  const theme = useTheme();
  return (
    <Stack
      sx={{
        width: "250px",
        height: "150px",
        backgroundColor: theme.palette.grey.main,
        borderRadius: "15px",
        padding: "10px",
      }}
      alignItems={"center"}
      justifyContent={"space-between"}
    >
      <Box>img</Box>
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

function Statistics() {
  const theme = useTheme();
  return (
    <Stack>
      <Stack direction={"column"} alignItems={"flex-start"}>
        <Stack direction={"row"}>
          <Box sx={{ border: "1px solid grey" }}>
            <MyGridChart />
          </Box>
          <Box sx={{ border: "1px solid grey" }}>
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
                          ? theme.palette.red.main // Red for the first item
                          : index === 1 || index === 2
                            ? "#81BCE0" // Blue for the second and third items
                            : "inherit", // Default color for the rest
                    }}
                  >
                    #{index + 1}
                  </Typography>
                  <Typography>{item.title}</Typography>
                </Stack>
                {index < dumm.length - 1 && ( // Conditional rendering to skip the last divider
                  <Divider variant="fullWidth" sx={{ width: "100%" }} />
                )}
              </Stack>
            ))}
          </Stack>
          {/* <Stack
            direction={"column"}
            sx={{
              width: "200px",
              height: "200px",
              backgroundColor: theme.palette.grey.main,
              borderRadius: "15px",
              padding: "15px",
            }}
            alignItems={"center"}
            gap={"5px"}
          >
            {dumm.map((item, index) => (
              <Stack key={index} sx={{ width: "100%" }}>
                <Stack direction={"row"} gap={"10px"}>
                  <Typography>#{index + 1}</Typography>
                  <Typography>{item.title}</Typography>
                </Stack>
                <Divider variant="fullWidth" sx={{ width: "100%" }} />
              </Stack>
            ))}
          </Stack> */}
        </Stack>
        <Stack sx={{ overflowX: "auto" }} direction={"row"} gap={"20px"}>
          {sales.map((item, index) => (
            <CardSale key={index} title={item.title}></CardSale>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}

export default Statistics;
