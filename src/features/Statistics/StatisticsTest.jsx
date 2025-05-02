import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Grid,
  Typography,
  Select,
  MenuItem,
  Skeleton,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTopShops,
  fetchTopProducts,
  fetchTopCategories,
  fetchEarnings,
} from "./statisticsSlice";
import { LineChart } from "@mui/x-charts/LineChart";
import ProductCard from "./ProductCard";
import StoreCard from "./StoreCard";

// Helper function to handle translation objects
function getTranslatedText(text, lang = "en") {
  if (!text) return "";
  if (typeof text === "string") {
    try {
      // Handle case where name might be a JSON string
      const parsed = JSON.parse(text);
      return parsed[lang] || parsed.en || "";
    } catch {
      return text;
    }
  }
  if (typeof text === "object") return text[lang] || text.en || "";
  return String(text);
}

const StatisticsTest = () => {
  const { t } = useTranslation(["statistics", "common"]);
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

  // Process data from Redux state to match UI needs
  const earningsData =
    earnings.data?.map((item) => ({
      period: item.period?.toString(),
      profit: item.profit,
    })) || [];

  const processedCategories =
    topCategories.data?.map((item) => ({
      id: item.category?.id,
      name: getTranslatedText(item.category?.name),
      total_sold: item.total_sold,
    })) || [];

  const processedProducts =
    topProducts.data?.map((item) => ({
      id: item.product?.id,
      name: getTranslatedText(item.product?.name),
      image: item.product?.image,
      sales_count: item.total_sold,
    })) || [];

  const processedShops =
    topShops.data?.map((item) => ({
      id: item.shop?.id,
      name: getTranslatedText(item.shop?.name),
      image: item.shop?.image,
      revenue: item.total_sold,
    })) || [];

  // Skeleton components
  const ProductSkeleton = () => (
    <Box sx={{ width: 200, height: 280, p: 1 }}>
      <Skeleton
        variant="rectangular"
        width="100%"
        height={120}
        sx={{ bgcolor: "#333" }}
      />
      <Skeleton width="60%" sx={{ bgcolor: "#333", mt: 1 }} />
      <Skeleton width="40%" sx={{ bgcolor: "#333" }} />
      <Skeleton width="30%" sx={{ bgcolor: "#333" }} />
    </Box>
  );

  const StoreSkeleton = () => (
    <Box sx={{ width: 200, height: 240, p: 1 }}>
      <Skeleton
        variant="circular"
        width={80}
        height={80}
        sx={{ bgcolor: "#333", mx: "auto" }}
      />
      <Skeleton width="70%" sx={{ bgcolor: "#333", mt: 2, mx: "auto" }} />
      <Skeleton width="50%" sx={{ bgcolor: "#333", mx: "auto" }} />
    </Box>
  );

  const ChartSkeleton = () => (
    <Box
      sx={{
        height: "90%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Skeleton
        variant="rectangular"
        width="100%"
        height="90%"
        sx={{ bgcolor: "#333" }}
      />
    </Box>
  );

  const CategorySkeleton = () => (
    <Box sx={{ mb: 1 }}>
      <Skeleton width="80%" sx={{ bgcolor: "#333" }} />
    </Box>
  );

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
        <Typography variant="h5">{t("title")}</Typography>
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
          <Typography variant="h6">{t("sections.earnings")}</Typography>
          <Select
            value={ranges.earnings}
            onChange={handleRangeChange("earnings")}
            variant="outlined"
            size="small"
            sx={{ minWidth: 120, color: "white" }}
          >
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </Box>
        <Box sx={{ height: "90%" }}>
          {earnings.status === false ? (
            <ChartSkeleton />
          ) : earningsData.length > 0 ? (
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
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                color: "gray",
              }}
            >
              No data available
            </Box>
          )}
        </Box>
      </Box>

      {/* Top Categories */}
      <Box sx={{ mb: 4, p: 2, backgroundColor: "#1e1e1e", borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">{t("sections.topCategories")}</Typography>
          <Select
            value={ranges.categories}
            onChange={handleRangeChange("categories")}
            variant="outlined"
            size="small"
            sx={{ minWidth: 120, color: "white" }}
          >
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </Box>
        <Box>
          {topCategories.status === false ? (
            Array.from({ length: 5 }).map((_, index) => (
              <CategorySkeleton key={`category-skeleton-${index}`} />
            ))
          ) : processedCategories.length > 0 ? (
            processedCategories.slice(0, 5).map((cat, idx) => (
              <Typography key={cat.id} sx={{ mb: 1 }}>
                #{idx + 1} {cat.name} - Sold: {cat.total_sold}
              </Typography>
            ))
          ) : (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100px",
                color: "gray",
              }}
            >
              No data available
            </Box>
          )}
        </Box>
      </Box>

      {/* Top Products */}
      <Box sx={{ mb: 4, p: 2, backgroundColor: "#1e1e1e", borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">{t("sections.topProducts")}</Typography>
          <Select
            value={ranges.products}
            onChange={handleRangeChange("products")}
            variant="outlined"
            size="small"
            sx={{ minWidth: 120, color: "white" }}
          >
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </Box>
        <Grid container spacing={2}>
          {topProducts.status === false ? (
            Array.from({ length: 5 }).map((_, index) => (
              <Grid item key={`product-skeleton-${index}`}>
                <ProductSkeleton />
              </Grid>
            ))
          ) : processedProducts.length > 0 ? (
            processedProducts.map((product, idx) => (
              <Grid item key={product.id}>
                <ProductCard
                  image={product.image}
                  name={product.name}
                  sales={product.sales_count}
                  rank={idx + 1}
                />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "200px",
                  color: "gray",
                }}
              >
                No data available
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>

      {/* Top Stores */}
      <Box sx={{ mb: 4, p: 2, backgroundColor: "#1e1e1e", borderRadius: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6">{t("sections.topStores")}</Typography>
          <Select
            value={ranges.shops}
            onChange={handleRangeChange("shops")}
            variant="outlined"
            size="small"
            sx={{ minWidth: 120, color: "white" }}
          >
            <MenuItem value="weekly">Weekly</MenuItem>
            <MenuItem value="monthly">Monthly</MenuItem>
            <MenuItem value="yearly">Yearly</MenuItem>
          </Select>
        </Box>
        <Grid container spacing={2}>
          {topShops.status === false ? (
            Array.from({ length: 5 }).map((_, index) => (
              <Grid item key={`store-skeleton-${index}`}>
                <StoreSkeleton />
              </Grid>
            ))
          ) : processedShops.length > 0 ? (
            processedShops.map((shop, idx) => (
              <Grid item key={shop.id}>
                <StoreCard
                  image={shop.image}
                  name={shop.name}
                  revenue={shop.revenue}
                  rank={idx + 1}
                />
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "200px",
                  color: "gray",
                }}
              >
                No data available
              </Box>
            </Grid>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default StatisticsTest;
