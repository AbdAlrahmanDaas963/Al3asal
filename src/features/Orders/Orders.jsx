import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, updateOrderStatus } from "./ordersSlice";
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, status, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleUpdateStatus = (orderId, status) => {
    dispatch(updateOrderStatus({ orderId, status }));
  };

  if (status === "loading") return <CircularProgress />;
  if (status === "failed") return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Orders
      </Typography>
      {orders.map((order) => (
        <Box key={order.id} sx={{ mb: 2, p: 2, border: "1px solid #ccc" }}>
          <Typography variant="h6">Order ID: {order.id}</Typography>
          <Typography>Status: {order.status}</Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleUpdateStatus(order.id, "preparing")}
            sx={{ mr: 2 }}
          >
            Mark as Preparing
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleUpdateStatus(order.id, "done")}
          >
            Mark as Done
          </Button>
        </Box>
      ))}
    </Box>
  );
};

export default Orders;
