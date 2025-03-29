import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Typography,
  IconButton,
  Button,
  Tabs,
  Tab,
  Chip,
  CircularProgress,
  Snackbar,
  Alert,
  Skeleton,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CrownIcon from "@mui/icons-material/LocalActivity";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import OrderDetailsModal from "./OrderDetailsModal";
import { useDispatch } from "react-redux";
import { fetchOrders, updateOrderStatus } from "./ordersSlice";

const statusFilters = ["all", "pending", "preparing", "done", "rejected"];
const statusColors = {
  done: "#A1FCB6",
  pending: "#6B56E0",
  rejected: "#E05656",
  preparing: "#FFDA85",
  default: "#9E9E9E",
};

const statusDisplayMap = {
  preparing: "Preparing",
  rejected: "Rejected",
  pending: "Pending",
  done: "Completed",
};

const OrdersTable2 = ({ orders = [], isLoading = false, error = null }) => {
  const dispatch = useDispatch();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [initialLoad, setInitialLoad] = useState(true);

  const rowsPerPage = 5;

  // Track initial load completion
  useEffect(() => {
    if (!isLoading && orders.length > 0) {
      setInitialLoad(false);
    }
  }, [isLoading, orders]);

  // Filter orders based on selected status
  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / rowsPerPage)
  );
  const currentItems = filteredOrders.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );

  const handleStatusChange = async (orderId, status, rejectReason = null) => {
    try {
      await dispatch(
        updateOrderStatus({ orderId, status, rejectReason })
      ).unwrap();

      setSnackbar({
        open: true,
        message: `Status updated to ${statusDisplayMap[status] || status}`,
        severity: "success",
      });

      // Refresh orders to get latest data
      dispatch(fetchOrders());
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      });
    }
  };

  // Reset to first page if current page is out of bounds
  useEffect(() => {
    if (page >= totalPages) setPage(0);
  }, [totalPages, page]);

  const renderSkeletonRows = () => {
    return Array.from({ length: rowsPerPage }).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell>
          <Skeleton variant="text" width={120} height={40} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width={80} height={40} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width={100} height={40} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width={150} height={40} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width={100} height={40} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width={80} height={40} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width={80} height={40} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width={100} height={36} />
        </TableCell>
      </TableRow>
    ));
  };

  const renderTableContent = () => {
    // Show skeletons if loading OR if initial load hasn't completed (empty array)
    if (isLoading || initialLoad) {
      return renderSkeletonRows();
    }

    if (error) {
      return (
        <TableRow>
          <TableCell colSpan={8} align="center" sx={{ py: 4, color: "white" }}>
            <Typography color="error">
              Error loading orders: {error.message}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => dispatch(fetchOrders())}
              sx={{ mt: 2 }}
            >
              Retry
            </Button>
          </TableCell>
        </TableRow>
      );
    }

    if (filteredOrders.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={8} align="center" sx={{ py: 4, color: "white" }}>
            <Typography>No orders found</Typography>
          </TableCell>
        </TableRow>
      );
    }

    return currentItems.map((order) => (
      <TableRow key={order.id}>
        <TableCell>
          <Box display="flex" alignItems="center">
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor:
                  statusColors[order.status] || statusColors.default,
                mr: 1,
              }}
            />
            <Typography sx={{ color: "white" }}>
              {order.reciver_name || "N/A"}
            </Typography>
          </Box>
        </TableCell>
        <TableCell sx={{ color: "white" }}>
          #{order.user?.id || order.id}
        </TableCell>
        <TableCell sx={{ color: "white" }}>
          <Chip label={order.category || "N/A"} size="small" />
        </TableCell>
        <TableCell sx={{ color: "white" }}>
          <Box display="flex" alignItems="center">
            <CreditCardIcon fontSize="small" sx={{ mr: 1, color: "white" }} />
            <Typography>
              {order.card_number
                ? `${order.card_number.slice(0, -4).replace(/./g, "•")}${order.card_number.slice(-4)}`
                : "•••• •••• •••• 0000"}
            </Typography>
          </Box>
        </TableCell>
        <TableCell sx={{ color: "white" }}>
          {new Date(order.date).toLocaleDateString()}
        </TableCell>
        <TableCell sx={{ color: "white" }}>
          ${order.total_price?.toFixed(2) || "0.00"}
        </TableCell>
        <TableCell sx={{ color: "white" }}>
          {order.user?.is_premium ? <CrownIcon color="warning" /> : "Regular"}
        </TableCell>
        <TableCell>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setSelectedOrder(order);
              setOpenModal(true);
            }}
          >
            Details
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Box sx={{ backgroundColor: "#121212", p: 2, borderRadius: 2 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Tabs
          value={statusFilters.indexOf(statusFilter)}
          onChange={(_, newValue) => {
            setStatusFilter(statusFilters[newValue]);
            setPage(0);
          }}
        >
          {statusFilters.map((status) => (
            <Tab
              key={status}
              label={
                <Box display="flex" alignItems="center">
                  {status !== "all" && (
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor:
                          statusColors[status] || statusColors.default,
                        mr: 1,
                      }}
                    />
                  )}
                  {status === "all"
                    ? "All"
                    : statusDisplayMap[status] || status}
                </Box>
              }
            />
          ))}
        </Tabs>
      </Box>

      <TableContainer
        component={Paper}
        sx={{ backgroundColor: "#121212", mt: 2 }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Customer</TableCell>
              <TableCell sx={{ color: "white" }}>Account ID</TableCell>
              <TableCell sx={{ color: "white" }}>Category</TableCell>
              <TableCell sx={{ color: "white" }}>Card</TableCell>
              <TableCell sx={{ color: "white" }}>Date</TableCell>
              <TableCell sx={{ color: "white" }}>Payment</TableCell>
              <TableCell sx={{ color: "white" }}>Premium</TableCell>
              <TableCell sx={{ color: "white" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderTableContent()}</TableBody>
        </Table>
      </TableContainer>

      {!isLoading && !initialLoad && filteredOrders.length > rowsPerPage && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ mt: 2, color: "white" }}
        >
          <IconButton
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
          >
            <ArrowBackIosIcon />
          </IconButton>
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              variant={i === page ? "contained" : "text"}
              onClick={() => setPage(i)}
              sx={{
                mx: 0.5,
                minWidth: 30,
                color: i === page ? "white" : "#ccc",
                backgroundColor: i === page ? "#E4272B" : "transparent",
              }}
            >
              {i + 1}
            </Button>
          ))}
          <IconButton
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      )}

      <OrderDetailsModal
        open={openModal}
        order={selectedOrder}
        onClose={() => setOpenModal(false)}
        onStatusChange={handleStatusChange}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default OrdersTable2;
