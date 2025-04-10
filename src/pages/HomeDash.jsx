import React, { useEffect } from "react";
import { Box, Stack, useMediaQuery } from "@mui/material";
import MyBarChart from "../components/MyBarChart";
import MyGridChart from "../components/MyGridChart";
import PersonIcon from "@mui/icons-material/Person";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import { useTheme } from "@mui/material/styles";
import OrdersTable from "../features/Orders/OrdersTable";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../features/Orders/ordersSlice";
import OrdersTable2 from "../features/Orders/OrdersTable2";

const TinyCard = ({ children, title, value }) => {
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
      </Stack>
    </Stack>
  );
};

function HomeDash() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders({ min_price: 0, per_page: 50 }));
  }, [dispatch]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        padding: isMobile ? "10px" : "20px",
        overflowX: "hidden",
      }}
    >
      <Stack
        direction="column"
        alignItems="flex-start"
        gap={isMobile ? "20px" : "30px"}
      >
        <Stack
          direction={isMobile ? "column" : "row"}
          gap={isMobile ? "15px" : "30px"}
          sx={{
            flexWrap: "wrap",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Box
            sx={{
              flex: 1,
              minWidth: isMobile ? "100%" : "300px",
              width: isMobile ? "100%" : "auto",
            }}
          >
            <MyBarChart />
          </Box>
          <Box
            sx={{
              flex: 1,
              minWidth: isMobile ? "100%" : "300px",
              width: isMobile ? "100%" : "auto",
            }}
          >
            <MyGridChart />
          </Box>
          <Stack
            direction={isMobile ? "column" : "row"}
            gap={isMobile ? "10px" : "20px"}
            sx={{ width: "100%" }}
          >
            <TinyCard title="Total Users" value="5000">
              <PersonIcon />
            </TinyCard>
            <TinyCard title="Top #10 Sales" value="iPhone 15 Pro">
              <LocalAtmIcon sx={{ color: "#000000" }} />
            </TinyCard>
          </Stack>
        </Stack>
        <Box sx={{ width: "100%", overflowX: isMobile ? "auto" : "hidden" }}>
          <OrdersTable2 orders={orders} rows={isMobile ? 3 : 5} />
        </Box>
      </Stack>
    </Box>
  );
}

export default HomeDash;
