import React, { useState, useEffect, useContext, useMemo } from "react";
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
  Snackbar,
  Alert,
  Skeleton,
  useMediaQuery,
  useTheme,
  Avatar,
  Tooltip,
} from "@mui/material";
import { CircularProgress } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import OrderDetailsModal from "./OrderDetailsModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, updateOrderStatus } from "./ordersSlice";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../contexts/LanguageContext";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import NotesIcon from "@mui/icons-material/Notes";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import { FaCrown } from "react-icons/fa";

const statusFilters = ["all", "pending", "preparing", "done", "rejected"];
const statusColors = {
  done: "#A1FCB6",
  pending: "#6B56E0",
  rejected: "#E05656",
  preparing: "#FFDA85",
  default: "#9E9E9E",
};

const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    return dateString;
  }
};

const OrdersTable2 = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation("ordersTable");
  const { direction } = useContext(LanguageContext);

  const orders = useSelector((state) => state.orders.orders);
  const isLoading = useSelector((state) => state.orders.isLoading);
  const error = useSelector((state) => state.orders.error);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(isMobile ? 3 : 10);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [updatingStatus, setUpdatingStatus] = useState({});

  useEffect(() => {
    setPage(0);
  }, [statusFilter]);

  useEffect(() => {
    dispatch(fetchOrders({ per_page: 1000 }));
  }, [dispatch]);

  const statusDisplayMap = {
    preparing: t("filters.preparing"),
    rejected: t("filters.rejected"),
    pending: t("filters.pending"),
    done: t("filters.done"),
  };

  const filteredOrders = useMemo(() => {
    const filtered =
      statusFilter === "all"
        ? [...orders]
        : orders.filter((order) => order.status === statusFilter);

    return filtered.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });
  }, [orders, statusFilter]);

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);
  const currentItems = useMemo(() => {
    return filteredOrders.slice(page * rowsPerPage, (page + 1) * rowsPerPage);
  }, [filteredOrders, page, rowsPerPage]);

  const handleStatusChange = async (params) => {
    const { orderId, newStatus, currentStatus, rejectReason } = params;

    setUpdatingStatus((prev) => ({ ...prev, [orderId]: true }));

    try {
      const resultAction = await dispatch(
        updateOrderStatus({ orderId, newStatus, currentStatus, rejectReason })
      );

      if (updateOrderStatus.fulfilled.match(resultAction)) {
        setSnackbar({
          open: true,
          message: `Status updated to ${newStatus}`,
          severity: "success",
        });

        dispatch(fetchOrders());
        console.log("🔄 Refetched orders after status update");
      } else {
        throw new Error("Status update failed.");
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.message || "Failed to update status",
        severity: "error",
      });
    } finally {
      setUpdatingStatus((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  useEffect(() => {
    if (page >= totalPages) setPage(0);
  }, [totalPages, page]);

  const renderSkeletonRows = () =>
    Array.from({ length: rowsPerPage }).map((_, index) => (
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
        {!isMobile && (
          <TableCell>
            <Skeleton variant="text" width={60} height={20} />
          </TableCell>
        )}
        {!isMobile && (
          <TableCell>
            <Skeleton variant="text" width={100} height={20} />
          </TableCell>
        )}
        <TableCell>
          <Skeleton variant="text" width={100} height={20} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width={80} height={20} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width={80} height={20} />
        </TableCell>
        <TableCell>
          <Skeleton variant="text" width={80} height={20} />
        </TableCell>
        <TableCell>
          <Skeleton variant="rectangular" width={100} height={36} />
        </TableCell>
      </TableRow>
    ));

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
              #{order.user?.id || order.id} • {formatDate(order.date)}
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
          color: "#000000 !important",
          minWidth: 80,
          fontWeight: 600,
        }}
      />
    </TableCell>
  );

  const renderPremiumCell = (order) => (
    <TableCell align="center">
      {order.is_premium ? (
        <Tooltip title="Premium Order">
          <FaCrown
            style={{
              color: "#FFD700",
              fontSize: "1.2rem",
            }}
          />
        </Tooltip>
      ) : (
        <Tooltip title="Standard Order">
          <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
            -
          </Typography>
        </Tooltip>
      )}
    </TableCell>
  );

  const renderNoteCell = (order) => (
    <TableCell>
      {order.note ? (
        <Tooltip title={order.note}>
          <NotesIcon color="primary" />
        </Tooltip>
      ) : (
        <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)" }}>
          -
        </Typography>
      )}
    </TableCell>
  );

  const renderTableContent = () => {
    if (isLoading || orders.length === 0) return renderSkeletonRows();
    if (error)
      return (
        <TableRow>
          <TableCell
            colSpan={isMobile ? 5 : 8}
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
            colSpan={isMobile ? 5 : 8}
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
        {!isMobile && (
          <TableCell sx={{ color: "white" }}>
            {formatDate(order.date)}
          </TableCell>
        )}
        {renderStatusCell(order)}
        <TableCell sx={{ color: "white" }}>
          ${order.total_price?.toFixed(2) || "0.00"}
        </TableCell>
        {!isMobile && renderPremiumCell(order)}
        {!isMobile && renderNoteCell(order)}
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
        sx={{ backgroundColor: "#121212", mt: 2, overflowX: "auto" }}
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
              {!isMobile && (
                <TableCell sx={{ color: "white" }}>
                  {t("table.headers.date")}
                </TableCell>
              )}
              <TableCell sx={{ color: "white" }}>
                {t("table.headers.status")}
              </TableCell>
              <TableCell sx={{ color: "white" }}>
                {t("table.headers.amount")}
              </TableCell>
              {!isMobile && (
                <TableCell sx={{ color: "white" }} align="center">
                  {t("table.headers.premium")}
                </TableCell>
              )}
              {!isMobile && (
                <TableCell sx={{ color: "white" }}>
                  {t("table.headers.note")}
                </TableCell>
              )}
              <TableCell sx={{ color: "white" }}>
                {t("table.headers.actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderTableContent()}</TableBody>
        </Table>
      </TableContainer>

      {!isLoading && filteredOrders.length > 0 && (
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
        onStatusChange={(params) => handleStatusChange(params)}
        isUpdating={selectedOrder ? updatingStatus[selectedOrder.id] : false}
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
