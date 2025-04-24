import React, { useState, useEffect, useContext } from "react";
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
  useMediaQuery,
  useTheme,
  Tooltip,
  Avatar,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CrownIcon from "@mui/icons-material/LocalActivity";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import OrderDetailsModal from "./OrderDetailsModal";
import { useDispatch } from "react-redux";
import { fetchOrders, updateOrderStatus } from "./ordersSlice";

import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../contexts/LanguageContext";

const statusFilters = ["all", "pending", "preparing", "done", "rejected"];
const statusColors = {
  done: "#A1FCB6",
  pending: "#6B56E0",
  rejected: "#E05656",
  preparing: "#FFDA85",
  default: "#9E9E9E",
};

const OrdersTable2 = ({ orders = [], isLoading = false, error = null }) => {
  const { t } = useTranslation("ordersTable");

  const statusDisplayMap = {
    preparing: t("filters.preparing"),
    rejected: t("filters.rejected"),
    pending: t("filters.pending"),
    done: t("filters.done"),
  };
  const { direction } = useContext(LanguageContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const dispatch = useDispatch();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 3 : 5);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [initialLoad, setInitialLoad] = useState(true);

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
        message: t("table.messages.statusUpdated", {
          status: statusDisplayMap[status] || status,
        }),
        severity: "success",
      });

      // Refresh orders to get latest data
      dispatch(fetchOrders());
    } catch (error) {
      setSnackbar({
        open: true,
        message: t("status.updateFailed", { error: error.message }),
        severity: "error",
      });
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Reset to first page if current page is out of bounds
  useEffect(() => {
    if (page >= totalPages) setPage(0);
  }, [totalPages, page]);

  const renderSkeletonRows = () => {
    return Array.from({ length: rowsPerPage }).map((_, index) => (
      <TableRow key={`skeleton-${index}`}>
        <TableCell>
          <Box display="flex" alignItems="center">
            <Skeleton variant="circular" width={40} height={40} />
            <Box ml={2}>
              <Skeleton variant="text" width={120} height={20} />
              <Skeleton variant="text" width={80} height={16} />
            </Box>
          </Box>
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width={80} height={20} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width={100} height={20} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width={80} height={20} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width={100} height={36} />
        </TableCell>
      </TableRow>
    ));
  };

  const renderCustomerCell = (order) => (
    <TableCell>
      <Box display="flex" alignItems="center">
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: statusColors[order.status] || statusColors.default,
            mr: 1.5,
            fontSize: "0.875rem",
          }}
        >
          {order.reciver_name?.charAt(0) || "?"}
        </Avatar>
        <Box>
          <Typography variant="body2" sx={{ color: "white", fontWeight: 500 }}>
            {order.reciver_name || "N/A"}
          </Typography>
          {isMobile && (
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.7)" }}
            >
              #{order.user?.id || order.id}
            </Typography>
          )}
        </Box>
      </Box>
    </TableCell>
  );

  const renderStatusCell = (order) => (
    <TableCell>
      <Chip
        label={statusDisplayMap[order.status] || order.status}
        size="small"
        sx={{
          backgroundColor: statusColors[order.status] || statusColors.default,
          color: "black",
          minWidth: 80,
        }}
      />
    </TableCell>
  );

  const renderTableContent = () => {
    if (isLoading || initialLoad) return renderSkeletonRows();
    if (error)
      return (
        <TableRow>
          <TableCell
            colSpan={isMobile ? 4 : 5}
            align="center"
            sx={{ py: 4, color: "white" }}
          >
            <Typography color="error">
              {t("table.messages.error", { error: error.message })}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => dispatch(fetchOrders())}
              sx={{ mt: 2 }}
            >
              {t("table.messages.retry")}
            </Button>
          </TableCell>
        </TableRow>
      );
    if (filteredOrders.length === 0)
      return (
        <TableRow>
          <TableCell
            colSpan={isMobile ? 4 : 5}
            align="center"
            sx={{ py: 4, color: "white" }}
          >
            <Typography>{t("table.messages.empty")}</Typography>
          </TableCell>
        </TableRow>
      );

    return currentItems.map((order) => (
      <TableRow key={order.id}>
        {renderCustomerCell(order)}
        {!isMobile && (
          <TableCell sx={{ color: "white" }}>
            #{order.user?.id || order.id}
          </TableCell>
        )}
        {renderStatusCell(order)}
        <TableCell sx={{ color: "white" }}>
          ${order.total_price?.toFixed(2) || "0.00"}
        </TableCell>
        <TableCell>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => {
              setSelectedOrder(order);
              setOpenModal(true);
            }}
            sx={{ minWidth: 90 }}
          >
            {t("table.buttons.details")}
          </Button>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <Box
      sx={{ backgroundColor: "#121212", p: isMobile ? 1 : 2, borderRadius: 2 }}
    >
      <Box
        display="flex"
        justifyContent={isMobile ? "center" : "space-between"}
        alignItems="center"
        mb={2}
        sx={{ overflowX: "auto" }}
      >
        <Tabs
          value={statusFilters.indexOf(statusFilter)}
          onChange={(_, newValue) => {
            setStatusFilter(statusFilters[newValue]);
            setPage(0);
          }}
          variant={isMobile ? "scrollable" : "standard"}
          scrollButtons="auto"
          allowScrollButtonsMobile
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
                    ? t("filters.all")
                    : statusDisplayMap[status] || status}
                </Box>
              }
              sx={{ minWidth: isMobile ? 80 : "auto", px: isMobile ? 1 : 2 }}
            />
          ))}
        </Tabs>
      </Box>

      <TableContainer
        component={Paper}
        sx={{
          backgroundColor: "#121212",
          mt: 2,
          overflowX: "auto",
          "&::-webkit-scrollbar": {
            height: "6px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#E4272B",
            borderRadius: "3px",
          },
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "white" }}>
                {t("table.headers.customer")}
              </TableCell>
              {!isMobile && (
                <TableCell sx={{ color: "white" }}>
                  {t("table.headers.accountId")}
                </TableCell>
              )}
              <TableCell sx={{ color: "white" }}>
                {t("table.headers.status")}
              </TableCell>
              <TableCell sx={{ color: "white" }}>
                {t("table.headers.amount")}
              </TableCell>
              <TableCell sx={{ color: "white" }}>
                {t("table.headers.actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderTableContent()}</TableBody>
        </Table>
      </TableContainer>

      {!isLoading && !initialLoad && filteredOrders.length > 0 && (
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
            <ArrowBackIosIcon fontSize={isMobile ? "small" : "medium"} />
          </IconButton>
          <Typography variant="body2" sx={{ mx: 2 }}>
            {page + 1} / {totalPages}
          </Typography>
          <IconButton
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            <ArrowForwardIosIcon fontSize={isMobile ? "small" : "medium"} />
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
