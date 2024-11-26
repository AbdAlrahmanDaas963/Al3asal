import React from "react";

import { Box, Stack } from "@mui/material";

import MyTable from "../components/MyTable";
import MyGridChart from "../components/MyGridChart";
import MyBarChart from "../components/MyBarChart";

function HomeDash() {
  return (
    <Stack direction={"column"} alignItems={"flex-start"}>
      <Stack direction={"row"}>
        <Box sx={{ border: "1px solid grey" }}>
          <MyBarChart />
        </Box>
        <Box sx={{ border: "1px solid grey" }}>
          <MyGridChart />
        </Box>
      </Stack>
      <MyTable />
    </Stack>
  );
}

export default HomeDash;
