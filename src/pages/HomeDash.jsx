import React, { useEffect } from "react";
import { Box, Stack } from "@mui/material";
import MyBarChart from "../components/MyBarChart";
import MyGridChart from "../components/MyGridChart";
import PersonIcon from "@mui/icons-material/Person";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import { useTheme } from "@mui/material/styles";
import OrdersTable from "../features/Orders/OrdersTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../features/Orders/ordersSlice";

const TinyCard = ({ children, title, value }) => {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      sx={{
        padding: "20px",
        background: theme.palette.grey.main,
        borderRadius: "20px",
        minWidth: "200px",
        flexGrow: 1,
      }}
      gap="20px"
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
        <Box color="white">{title}</Box>
        <Box fontWeight="bold" color="white">
          {value}
        </Box>
      </Stack>
    </Stack>
  );
};

function HomeDash() {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders({ min_price: 0, per_page: 50 })); // Fetch orders from API
  }, [dispatch]);

  return (
    <Box sx={{ width: "100%", height: "100%", padding: "20px" }}>
      <Stack direction="column" alignItems="flex-start" gap="30px">
        <Stack
          direction="row"
          gap="30px"
          sx={{
            flexWrap: "wrap",
            justifyContent: "space-between",
            minWidth: "100%",
          }}
        >
          <Box sx={{ flex: 1, minWidth: "300px" }}>
            <MyBarChart />
          </Box>
          <Box sx={{ flex: 1, minWidth: "300px" }}>
            <MyGridChart />
          </Box>
          <Stack gap="5px">
            <TinyCard title="Total Users" value="5000">
              <PersonIcon />
            </TinyCard>
            <TinyCard title="Top #10 Sales" value="iPhone 15 Pro">
              <LocalAtmIcon sx={{ color: "#000000" }} />
            </TinyCard>
          </Stack>
        </Stack>
        <OrdersTable orders={orders} rows={5} />
      </Stack>
    </Box>
  );
}

export default HomeDash;
