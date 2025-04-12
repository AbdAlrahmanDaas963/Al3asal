import React, { useEffect, useState } from "react";
import { Box, Grid, Typography, Select, MenuItem } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTopShops,
  fetchTopProducts,
  fetchTopCategories,
  fetchEarnings,
} from "./statisticsSlice";
import { LineChart } from "@mui/x-charts/LineChart";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ProductCard from "./ProductCard";
import StoreCard from "./StoreCard";

const StatisticsTest = () => {
  const dispatch = useDispatch();
  const [ranges, setRanges] = useState({
    earnings: "monthly",
    categories: "monthly",
    products: "monthly",
    shops: "monthly",
  });

  const { topShops, topProducts, topCategories, earnings, loading, error } =
    useSelector((state) => state.statistics);

  useEffect(() => {
    dispatch(fetchEarnings(ranges.earnings));
    dispatch(fetchTopCategories(ranges.categories));
    dispatch(fetchTopProducts(ranges.products));
    dispatch(fetchTopShops(ranges.shops));
  }, [dispatch, ranges]);

  const handleRangeChange = (section) => (e) => {
    setRanges((prev) => ({
      ...prev,
      [section]: e.target.value,
    }));
  };

  // const earningsData = earnings.map((item) => ({
  //   month: item.month,
  //   total: item.total,
  // }));

  const earningsData = earnings.map((item) => ({
    period: item.period.toString(),
    profit: item.profit,
  }));

  return (
    <Box
      sx={{
        p: 2,
        color: "white",
        backgroundColor: "#121212",
        minHeight: "100vh",
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 4 }}>
        <Typography variant="h5">My Expense</Typography>
      </Box>

      {/* Earnings Chart */}
      <Box
        sx={{
          mb: 4,
          height: 300,
          backgroundColor: "#1e1e1e",
          p: 2,
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Earnings</Typography>
          <Select
            value={ranges.earnings}
            onChange={handleRangeChange("earnings")}
            variant="outlined"
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </Box>
        <Box sx={{ height: "90%" }}>
          <LineChart
            series={[
              {
                data: earningsData.map((item) => item.profit),
                label: "Profit",
                color: "#8884d8",
              },
            ]}
            xAxis={[
              {
                scaleType: "point",
                data: earningsData.map((item) => item.period),
                label:
                  ranges.earnings === "yearly"
                    ? "Year"
                    : ranges.earnings === "monthly"
                      ? "Month"
                      : "Week",
              },
            ]}
            yAxis={[
              {
                label: "Amount ($)",
              },
            ]}
            grid={{ vertical: true, horizontal: true }}
            sx={{
              "& .MuiChartsAxis-tickLabel": {
                fill: "white",
              },
              "& .MuiChartsAxis-line": {
                stroke: "white",
              },
              "& .MuiChartsAxis-label": {
                fill: "white",
              },
            }}
          />
        </Box>
      </Box>

      {/* Top Categories */}
      <Box
        sx={{
          mb: 4,
          p: 2,
          backgroundColor: "#1e1e1e",
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Top Categories</Typography>
          <Select
            value={ranges.categories}
            onChange={handleRangeChange("categories")}
            variant="outlined"
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </Box>
        <Box>
          {topCategories.slice(0, 5).map((cat, idx) => (
            <Typography key={cat.id} sx={{ mb: 1 }}>
              #{idx + 1} {cat.name}
            </Typography>
          ))}
        </Box>
      </Box>

      {/* Top Sales */}
      <Box
        sx={{
          mb: 4,
          p: 2,
          backgroundColor: "#1e1e1e",
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Top Sales</Typography>
          <Select
            value={ranges.products}
            onChange={handleRangeChange("products")}
            variant="outlined"
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </Box>
        <Grid container spacing={2}>
          {topProducts.map((product, idx) => (
            <Grid item key={idx}>
              <ProductCard
                image={product.image}
                name={product.name}
                sales={product.sales_count}
                rank={idx + 1}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Top Stores */}
      <Box
        sx={{
          mb: 4,
          p: 2,
          backgroundColor: "#1e1e1e",
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">Top Stores</Typography>
          <Select
            value={ranges.shops}
            onChange={handleRangeChange("shops")}
            variant="outlined"
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </Box>
        <Grid container spacing={2}>
          {topShops.map((shop, idx) => (
            <Grid item key={idx}>
              <StoreCard
                image={shop.image}
                name={shop.name}
                revenue={shop.revenue}
                rank={idx + 1}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default StatisticsTest;
