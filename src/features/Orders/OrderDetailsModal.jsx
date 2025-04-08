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
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CrownIcon from "@mui/icons-material/EmojiEvents";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SaveIcon from "@mui/icons-material/Save";
import FileCopyIcon from "@mui/icons-material/FileCopy";

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

const getAvailableStatuses = (currentStatus) => {
  if (currentStatus === "pending") return ["preparing", "rejected"];
  if (currentStatus === "preparing") return ["done"];
  return [];
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

const OrderDetailsModal = ({
  open,
  order,
  onClose,
  onStatusChange,
  isUpdating,
}) => {
  const [selectedStatus, setSelectedStatus] = useState(
    order?.status || "pending"
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  if (!order) return null;

  const availableStatuses = getAvailableStatuses(order.status);
  const showRejectReason = selectedStatus === "rejected";

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setAnchorEl(null);
  };

  const handleSaveStatus = async () => {
    await onStatusChange(
      order.id,
      selectedStatus,
      showRejectReason ? rejectReason : null
    );
  };

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
        <Typography variant="h6" gutterBottom>
          Products ({order.items.length})
        </Typography>
        <Grid container spacing={2}>
          {order.items.map((item, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ backgroundColor: "#292929", color: "white" }}>
                <CardContent>
                  <Typography fontWeight="medium">
                    {item.product_name}
                  </Typography>
                  <Typography color="#ccc" mt={0.5}>
                    {item.quantity} × ${item.product_price}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" mt={1.5}>
                    <Typography color="#aaa">Subtotal</Typography>
                    <Typography fontWeight="medium">
                      ${(item.quantity * item.product_price).toFixed(2)}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

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
                <DetailItem label="Category" value={order.category} />
              </Grid>
            </Grid>
          </Box>
        </Box>

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
                    disabled={!availableStatuses.length}
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
                    onChange={(e) => setRejectReason(e.target.value)}
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
          startIcon={isUpdating ? <CircularProgress size={20} /> : <SaveIcon />}
          disabled={
            (showRejectReason && !rejectReason) ||
            isUpdating ||
            !availableStatuses.length
          }
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

const DetailItem = ({ label, value }) => (
  <Box mb={2}>
    <Typography variant="subtitle2" color="#aaa">
      {label}
    </Typography>
    {typeof value === "string" || typeof value === "number" ? (
      <Typography variant="body1" mt={0.5}>
        {value}
      </Typography>
    ) : (
      <Box mt={0.5}>{value}</Box>
    )}
  </Box>
);

export default OrderDetailsModal;
