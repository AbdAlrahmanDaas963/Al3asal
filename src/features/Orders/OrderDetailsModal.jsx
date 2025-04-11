import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  Box,
  Menu,
  MenuItem,
  CircularProgress,
  Chip,
  TextField,
  Tooltip,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { updateOrderStatus } from "./ordersSlice";

import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CrownIcon from "@mui/icons-material/EmojiEvents";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SaveIcon from "@mui/icons-material/Save";
import FileCopyIcon from "@mui/icons-material/FileCopy";

const statusColors = {
  done: "#A1FCB6",
  pending: "#6B56E0",
  rejected: "#E05656", // Changed back to 'rejected' for frontend consistency
  preparing: "#FFDA85",
  default: "#9E9E9E",
};

const statusDisplayMap = {
  preparing: "Preparing",
  rejected: "Rejected", // Frontend uses 'rejected'
  pending: "Pending",
  done: "Completed",

  prepering: "Preparing",
  fail: "Rejected",
};

const getAvailableStatuses = (currentStatus) => {
  const transitions = {
    pending: ["preparing"], // pending can only become preparing
    preparing: ["done"], // preparing can only become done
    rejected: ["done"], // rejected can only become done
  };
  return transitions[currentStatus] || []; // Return empty array for invalid/unknown statuses
};

const CopyableLocation = ({ location }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(location);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box display="flex" alignItems="center">
      {location}
      <LocationOnIcon sx={{ fontSize: 16, ml: 0.5, color: "#E4272B" }} />
      <Tooltip title={copied ? "Copied!" : "Copy location"} arrow>
        <IconButton onClick={handleCopy} size="small" sx={{ ml: 0.5 }}>
          <FileCopyIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

const renderMultilingualText = (text) => {
  if (!text) return null;
  if (typeof text === "string") return text;
  if (typeof text === "object" && text.en && text.ar) {
    return text.en;
  }
  return JSON.stringify(text);
};

const DetailItem = ({ label, value }) => (
  <Box mb={2}>
    <Typography variant="subtitle2" color="#aaa">
      {label}
    </Typography>
    {React.isValidElement(value) ? (
      <Box mt={0.5}>{value}</Box>
    ) : (
      <Typography variant="body1" mt={0.5}>
        {value}
      </Typography>
    )}
  </Box>
);

const OrderDetailsModal = ({ open, order, onClose }) => {
  const dispatch = useDispatch();
  const [selectedStatus, setSelectedStatus] = useState(
    order?.status || "pending"
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
      setRejectReason("");
      setHasChanges(false);
    }
  }, [order]);

  if (!order) return null;

  const availableStatuses = getAvailableStatuses(order.status);
  const showRejectReason = selectedStatus === "rejected"; // Frontend uses 'rejected'

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setAnchorEl(null);
    setHasChanges(true);
    if (status !== "rejected") {
      // Frontend uses 'rejected'
      setRejectReason("");
    }
  };

  // In your handleSaveStatus function, ensure you're using the correct status values
  const handleSaveStatus = async () => {
    if (selectedStatus === "rejected" && !rejectReason.trim()) {
      // Frontend uses 'rejected'
      setError("Please provide a rejection reason");
      return;
    }

    try {
      setStatusUpdating(true);
      setError(null);

      await dispatch(
        updateOrderStatus({
          orderId: order.id,
          newStatus: selectedStatus, // The thunk will handle conversion to backend names
          currentStatus: order.status,
          rejectReason:
            selectedStatus === "rejected" ? rejectReason.trim() : null, // Frontend uses 'rejected'
        })
      ).unwrap();

      onClose();
    } catch (err) {
      setError(err);
    } finally {
      setStatusUpdating(false);
    }
  };

  const hasValidChanges =
    hasChanges &&
    selectedStatus !== order.status &&
    (!showRejectReason || (showRejectReason && rejectReason));

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ backgroundColor: "#121212", color: "white" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <Typography variant="h6">Order #{order.id}</Typography>
            <Chip
              label={statusDisplayMap[order.status] || order.status}
              sx={{
                ml: 2,
                backgroundColor:
                  statusColors[order.status] || statusColors.default,
                color: "white",
                fontWeight: "bold",
              }}
            />
          </Box>
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{ backgroundColor: "#121212", color: "white" }}
      >
        {/* Products List */}
        <Typography variant="h6" gutterBottom>
          Products ({order.items.length})
        </Typography>
        <Grid container spacing={2}>
          {order.items.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ backgroundColor: "#292929", color: "white" }}>
                <CardContent>
                  <Typography fontWeight="medium">
                    {renderMultilingualText(item.product_name)}
                  </Typography>
                  <Typography color="#ccc" mt={0.5}>
                    {item.quantity} × ${item.product_final_price || item.price}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" mt={1.5}>
                    <Typography color="#aaa">Subtotal</Typography>
                    <Typography fontWeight="medium">
                      $
                      {(
                        item.quantity * (item.product_final_price || item.price)
                      ).toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Order Details */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Order Details
          </Typography>
          <Box sx={{ backgroundColor: "#292929", p: 3, borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <DetailItem label="Customer Name" value={order.user?.name} />
                <DetailItem label="Receiver Name" value={order.reciver_name} />
                <DetailItem label="Order ID" value={`#${order.id}`} />
                <DetailItem
                  label="Payment Card"
                  value={
                    order.card_number
                      ? `${order.card_number.slice(0, -4).replace(/./g, "•")}${order.card_number.slice(-4)}`
                      : "•••• •••• •••• ••••"
                  }
                />
                <DetailItem
                  label="Location"
                  value={<CopyableLocation location="54.5461, 71.5149" />}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DetailItem label="Customer Email" value={order.user?.email} />
                <DetailItem
                  label="Receiver Phone"
                  value={order.reciver_phone}
                />
                <DetailItem
                  label="Delivery Date"
                  value={
                    <span style={{ color: "#E4272B" }}>
                      {new Date(order.date).toLocaleString()}
                    </span>
                  }
                />
                <DetailItem
                  label="Total Payment"
                  value={`$${order.total_price}`}
                />
                <DetailItem
                  label="Category"
                  value={renderMultilingualText(order.items[0]?.category_name)}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Premium Info */}
        {order.user?.is_premium && (
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              <CrownIcon sx={{ color: "#E4272B", mr: 1, fontSize: 20 }} />
              Premium Service
            </Typography>
            <Box sx={{ backgroundColor: "#292929", p: 3, borderRadius: 2 }}>
              <DetailItem
                label="Delivery Date"
                value={
                  <span style={{ color: "#E4272B" }}>
                    {new Date(order.date).toLocaleString()}
                  </span>
                }
              />
              <Box mt={2}>
                <Typography color="#aaa" gutterBottom>
                  Attachments
                </Typography>
                <Box display="flex" gap={1.5}>
                  {[1, 2, 3].map((item) => (
                    <Box
                      key={item}
                      sx={{
                        width: 48,
                        height: 48,
                        backgroundColor: "#414141",
                        borderRadius: 1,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography>📷</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        )}

        {/* Status Change Section */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Update Order Status
          </Typography>
          <Box sx={{ backgroundColor: "#292929", p: 3, borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography color="#aaa" gutterBottom>
                  New Status
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Button
                    variant="outlined"
                    onClick={(e) => setAnchorEl(e.currentTarget)}
                    endIcon={<ExpandMoreIcon />}
                    disabled={availableStatuses.length === 0}
                  >
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor:
                          statusColors[selectedStatus] || statusColors.default,
                        mr: 1,
                      }}
                    />
                    {statusDisplayMap[selectedStatus] || selectedStatus}
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                  >
                    {availableStatuses.map((status) => (
                      <MenuItem
                        key={status}
                        onClick={() => handleStatusSelect(status)}
                      >
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            backgroundColor: statusColors[status],
                            mr: 1.5,
                          }}
                        />
                        {statusDisplayMap[status]}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              </Grid>

              {showRejectReason && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Rejection Reason"
                    value={rejectReason}
                    onChange={(e) => {
                      setRejectReason(e.target.value);
                      setHasChanges(true);
                    }}
                    required
                    sx={{
                      "& .MuiInputBase-root": { color: "white" },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#555" },
                        "&:hover fieldset": { borderColor: "#777" },
                      },
                      "& .MuiInputLabel-root": { color: "#aaa" },
                    }}
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ backgroundColor: "#121212", p: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{ color: "white", borderColor: "#555", mr: 2 }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSaveStatus}
          startIcon={
            statusUpdating ? <CircularProgress size={20} /> : <SaveIcon />
          }
          disabled={!hasValidChanges || statusUpdating}
          sx={{
            backgroundColor: "#4CAF50",
            color: "white",
            "&:hover": { backgroundColor: "#3e8e41" },
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsModal;
