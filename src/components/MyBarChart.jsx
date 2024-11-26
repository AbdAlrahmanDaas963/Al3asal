import React from "react";
import { BarChart } from "@mui/x-charts/BarChart";

function MyBarChart() {
  return (
    <BarChart
      xAxis={[
        {
          scaleType: "band",
          data: ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
        },
      ]}
      borderRadius={"20px"}
      series={[{ data: [4, 3, 5, 2, 3, 4] }]}
      width={350}
      height={200}
    />
  );
}

export default MyBarChart;
