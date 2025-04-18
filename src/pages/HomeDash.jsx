import React, { useEffect, useState } from "react";
import {
  Box,
  Stack,
  useMediaQuery,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import { useTheme } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../features/Orders/ordersSlice";
import OrdersTable2 from "../features/Orders/OrdersTable2";
import {
  fetchTopSales,
  fetchEarnings,
} from "../features/Statistics/statisticsSlice";
import { LineChart } from "@mui/x-charts/LineChart";

import { useTranslation } from "react-i18next";

const TinyCard = ({ children, title, value, subValue }) => {
  const { t } = useTranslation("homeDash");

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Stack
      direction="row"
      sx={{
        padding: isMobile ? "12px" : "20px",
        background: theme.palette.grey.main,
        borderRadius: "20px",
        minWidth: isMobile ? "100%" : "200px",
        flexGrow: 1,
      }}
      gap={isMobile ? "12px" : "20px"}
    >
      <Box
        sx={{
          backgroundColor: "#02b2af",
          borderRadius: "50%",
          width: isMobile ? "40px" : "50px",
          height: isMobile ? "40px" : "50px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {React.cloneElement(children, {
          sx: { fontSize: isMobile ? "20px" : "24px" },
        })}
      </Box>
      <Stack>
        <Box color="white" fontSize={isMobile ? "0.8rem" : "0.9rem"}>
          {title}
        </Box>
        <Box
          fontWeight="bold"
          color="white"
          fontSize={isMobile ? "1rem" : "1.1rem"}
        >
          {value}
        </Box>
        {subValue && (
          <Box color="white" fontSize={isMobile ? "0.7rem" : "0.8rem"}>
            {subValue}
          </Box>
        )}
      </Stack>
    </Stack>
  );
};

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

function HomeDash() {
  const { t } = useTranslation("homeDash");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useDispatch();

  const [range, setRange] = useState("monthly");
  const [language] = useState("en");

  const { orders } = useSelector((state) => state.orders);
  const { topSales, earnings, loading, error } = useSelector(
    (state) => state.statistics
  );

  useEffect(() => {
    dispatch(fetchOrders({ min_price: 0, per_page: 50 }));
    dispatch(fetchEarnings(range));
    dispatch(fetchTopSales(range));
  }, [dispatch, range]);

  const handleRangeChange = (e) => {
    setRange(e.target.value);
  };

  // Process earnings data for chart
  const earningsData =
    earnings?.data?.map((item) => ({
      period: item.period?.toString(),
      profit: item.profit,
    })) || [];

  // Get top product info from topSales
  const topProduct = topSales?.data?.most_sold_product;
  const usersCount = topSales?.usersCount || 0;

  const topProductName = topProduct
    ? getTranslatedText(topProduct.name, language)
    : "No sales data";

  const topSalesCount = topProduct ? parseInt(topProduct.quantity) || 0 : 0;

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        padding: isMobile ? "10px" : "20px",
        overflowX: "hidden",
        backgroundColor: "#121212",
        color: "white",
      }}
    >
      <Stack
        direction="column"
        alignItems="flex-start"
        gap={isMobile ? "20px" : "30px"}
      >
        {/* Earnings Chart */}
        <Box
          sx={{
            width: "100%",
            height: 300,
            backgroundColor: "#1e1e1e",
            p: 2,
            borderRadius: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6">{t("earnings.title")}</Typography>
            <Select
              value={range}
              onChange={handleRangeChange}
              variant="outlined"
              size="small"
              sx={{ minWidth: 120, color: "white" }}
            >
              <MenuItem value="weekly">
                {t("earnings.timeRanges.weekly")}
              </MenuItem>
              <MenuItem value="monthly">
                {t("earnings.timeRanges.monthly")}
              </MenuItem>
              <MenuItem value="yearly">
                {t("earnings.timeRanges.yearly")}
              </MenuItem>
            </Select>
          </Box>
          <Box sx={{ height: "90%" }}>
            {earningsData.length > 0 ? (
              <LineChart
                series={[
                  {
                    data: earningsData.map((item) => item.profit),
                    label: t("earnings.chartLabels.profit"),
                    color: "#8884d8",
                  },
                ]}
                xAxis={[
                  {
                    scaleType: "point",
                    data: earningsData.map((item) => item.period),
                    label: t(
                      `earnings.chartLabels.${
                        range === "yearly"
                          ? "year"
                          : range === "monthly"
                            ? "month"
                            : "week"
                      }`
                    ),
                  },
                ]}
                yAxis={[
                  {
                    label: t("earnings.chartLabels.amount"),
                  },
                ]}
                grid={{ vertical: true, horizontal: true }}
                sx={{
                  "& .MuiChartsAxis-tickLabel": { fill: "white" },
                  "& .MuiChartsAxis-line": { stroke: "white" },
                  "& .MuiChartsAxis-label": { fill: "white" },
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
                {loading
                  ? t("earnings.messages.loading")
                  : t("earnings.messages.noData")}
              </Box>
            )}
          </Box>
        </Box>

        {/* Stats Cards Row */}
        <Stack
          direction={isMobile ? "column" : "row"}
          gap={isMobile ? "10px" : "20px"}
          sx={{ width: "100%" }}
        >
          <TinyCard
            title={t("stats.totalUsers.title")}
            value={usersCount.toLocaleString()}
            subValue={t("stats.totalUsers.subtitle")}
          >
            <PersonIcon />
          </TinyCard>

          <TinyCard
            title={t("stats.topProduct.title")}
            value={topProductName}
            subValue={
              topSalesCount > 0
                ? t("stats.topProduct.salesCount", { count: topSalesCount })
                : t("stats.topProduct.noData")
            }
          >
            <LocalAtmIcon sx={{ color: "#000000" }} />
          </TinyCard>
        </Stack>

        {/* Orders Table */}
        <Box sx={{ width: "100%", overflowX: isMobile ? "auto" : "hidden" }}>
          <OrdersTable2 orders={orders} rows={isMobile ? 3 : 5} />
        </Box>
      </Stack>
    </Box>
  );
}

export default HomeDash;
