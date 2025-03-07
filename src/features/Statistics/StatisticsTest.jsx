import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTopShops,
  fetchTopCategories,
  fetchTopProducts,
  fetchEarnings,
} from "./statisticsSlice";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  MenuItem,
  Select,
} from "@mui/material";

const StatisticsTest = () => {
  const dispatch = useDispatch();
  const { topShops, topCategories, topProducts, earnings, status } =
    useSelector((state) => state.statistics);

  useEffect(() => {
    dispatch(fetchTopShops());
    dispatch(fetchTopCategories());
    dispatch(fetchTopProducts());
    dispatch(fetchEarnings());
  }, [dispatch]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "16px",
        padding: "20px",
      }}
    >
      <Card>
        <CardContent>
          <Typography variant="h6">Top Shops</Typography>
          {status === "loading" ? (
            <CircularProgress />
          ) : (
            <Typography>{topShops?.length || 0} Shops</Typography>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6">Top Categories</Typography>
          {status === "loading" ? (
            <CircularProgress />
          ) : (
            <Typography>{topCategories?.length || 0} Categories</Typography>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6">Top Products</Typography>
          {status === "loading" ? (
            <CircularProgress />
          ) : (
            <Typography>{topProducts?.length || 0} Products</Typography>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Typography variant="h6">Earnings</Typography>
          {status === "loading" ? (
            <CircularProgress />
          ) : (
            <Typography>${earnings?.total || 0}</Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsTest;
