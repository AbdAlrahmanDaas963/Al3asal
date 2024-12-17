import React from "react";

import { Box, Stack, Typography } from "@mui/material";

import MyTable from "../components/MyTable";
import MyGridChart from "../components/MyGridChart";
import MyBarChart from "../components/MyBarChart";

import PersonIcon from "@mui/icons-material/Person";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";

import { useTheme } from "@mui/material/styles";

const TinyCard = ({ children, title, value }) => {
  const theme = useTheme();

  return (
    <Stack
      direction={"row"}
      sx={{
        padding: "20px",
        background: theme.palette.grey.main,
        borderRadius: "20px",
      }}
      gap={"20px"}
    >
      <Box
        sx={{
          backgroundColor: "#02b2af",
          borderRadius: "50%",
          width: "50px",
          height: "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </Box>
      <Stack>
        <Typography>{title}</Typography>
        <Typography fontWeight={"bold"}>{value}</Typography>
      </Stack>
    </Stack>
  );
};

function HomeDash() {
  const theme = useTheme();

  return (
    <Stack direction={"column"} alignItems={"flex-start"}>
      <Stack direction={"row"}>
        <Box sx={{ border: "1px solid grey" }}>
          <MyBarChart />
        </Box>
        <Box sx={{ border: "1px solid grey" }}>
          <MyGridChart />
        </Box>
        <Stack gap={"5px"}>
          <TinyCard title={"Total Users"} value={"5000"}>
            <PersonIcon htmlColor={theme.palette.grey.main} />
          </TinyCard>
          <TinyCard title={"Top #10 Sales"} value={"I Phone 15 Pro "}>
            <LocalAtmIcon sx={{ color: "#000000" }} />
          </TinyCard>
        </Stack>
      </Stack>
      <MyTable />
    </Stack>
  );
}

export default HomeDash;
