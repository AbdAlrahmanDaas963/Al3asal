import {
  fetchTopShops,
  fetchTopCategories,
  fetchTopProducts,
  fetchEarnings,
} from "./statisticsSlice";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Card,
  CardContent,
  Typography,
  Grid,
  MenuItem,
  Select,
} from "@mui/material";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const StatisticsTest = () => {
  const dispatch = useDispatch();
  const { topShops, topCategories, topProducts, earnings, loading } =
    useSelector((state) => state.statistics);

  useEffect(() => {
    dispatch(fetchTopShops());
    dispatch(fetchTopCategories());
    dispatch(fetchTopProducts());
    dispatch(fetchEarnings());
  }, [dispatch]);

  const expenseData = [
    { name: "Jul", value: 200 },
    { name: "Aug", value: 450 },
    { name: "Sep", value: 600 },
    { name: "Oct", value: 700 },
    { name: "Nov", value: 500 },
  ];

  const activityData = [
    { day: "Sat", dayValue: 400, nightValue: 200 },
    { day: "Sun", dayValue: 300, nightValue: 100 },
    { day: "Mon", dayValue: 500, nightValue: 300 },
    { day: "Tue", dayValue: 600, nightValue: 400 },
    { day: "Wed", dayValue: 250, nightValue: 150 },
  ];

  return (
    <Grid
      container
      spacing={3}
      sx={{ padding: "20px", background: "#181818", color: "white" }}
    >
      {/* Expense Chart */}
      <Grid item xs={12} md={6}>
        <Card sx={{ background: "#222", color: "white" }}>
          <CardContent>
            <Typography variant="h6">My Expense</Typography>
            <Select
              size="small"
              sx={{ float: "right", color: "white" }}
              defaultValue="Monthly"
            >
              <MenuItem value="Monthly">Monthly</MenuItem>
              <MenuItem value="Weekly">Weekly</MenuItem>
            </Select>
            <LineChart width={300} height={200} data={expenseData}>
              <XAxis dataKey="name" stroke="white" />
              <YAxis stroke="white" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#3f51b5"
                strokeWidth={2}
              />
            </LineChart>
          </CardContent>
        </Card>
      </Grid>

      {/* Weekly App Activity */}
      <Grid item xs={12} md={6}>
        <Card sx={{ background: "#222", color: "white" }}>
          <CardContent>
            <Typography variant="h6">Weekly App Activity</Typography>
            <BarChart width={300} height={200} data={activityData}>
              <XAxis dataKey="day" stroke="white" />
              <YAxis stroke="white" />
              <Tooltip />
              <Legend />
              <Bar dataKey="dayValue" fill="#ffcc00" name="Day" />
              <Bar dataKey="nightValue" fill="#3f51b5" name="Night" />
            </BarChart>
          </CardContent>
        </Card>
      </Grid>

      {/* Top Categories */}
      <Grid item xs={12} md={4}>
        <Card sx={{ background: "#222", color: "white" }}>
          <CardContent>
            <Typography variant="h6">Top Categories</Typography>
            <ul>
              {topCategories?.data?.map((category, index) => (
                <li key={index} style={{ color: "#ccc" }}>
                  <strong>#{index + 1}</strong> {category.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </Grid>

      {/* Top Sales */}
      <Grid item xs={12} md={8}>
        <Card sx={{ background: "#222", color: "white" }}>
          <CardContent>
            <Typography variant="h6">Top Sales</Typography>
            <Grid container spacing={2}>
              {topProducts?.map((product, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <Card sx={{ background: "#333" }}>
                    <img
                      src={product.image || "https://via.placeholder.com/150"}
                      alt={product.name}
                      style={{
                        width: "100%",
                        height: "150px",
                        objectFit: "cover",
                      }}
                    />
                    <CardContent>
                      <Typography variant="body2" color="white">
                        <strong>Product Name:</strong>{" "}
                        {product.name || "Gift name should be here"}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Top Stores */}
      <Grid item xs={12}>
        <Card sx={{ background: "#222", color: "white" }}>
          <CardContent>
            <Typography variant="h6">Top Stores</Typography>
            <Grid container spacing={2}>
              {topShops?.map((shop, index) => (
                <Grid item xs={12} sm={3} key={index}>
                  <Card sx={{ background: "#333" }}>
                    <img
                      src={shop.logo || "https://via.placeholder.com/100"}
                      alt={shop.name}
                      style={{
                        width: "100%",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default StatisticsTest;
