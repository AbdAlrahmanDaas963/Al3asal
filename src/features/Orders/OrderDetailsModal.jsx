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
  Alert,
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { updateOrderStatus } from "./ordersSlice";
import { useTheme } from "@mui/material/styles";
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

const getAvailableStatuses = (currentStatus) => {
  const transitions = {
    pending: ["preparing", "rejected"],
    preparing: ["done"],
    rejected: [],
  };
  return transitions[currentStatus] || [];
};

const CopyableLocation = ({ location, copyText, copiedText }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(location);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Box display="flex" alignItems="center">
      {location}
      <Tooltip title={copied ? copiedText : copyText} arrow>
        <IconButton onClick={handleCopy} size="small" sx={{ ml: 0.5 }}>
          <FileCopyIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

const renderMultilingualText = (text) => {
  if (!text) return null;
  if (typeof text === "string") return <>{text}</>;
  if (typeof text === "object" && text.en && text.ar) {
    return <>{text.en}</>;
  }
  return <>{JSON.stringify(text)}</>;
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

const OrderDetailsModal = ({
  open,
  order,
  onClose,
  onStatusChange,
  isUpdating,
}) => {
  const theme = useTheme();
  const isRTL = theme.direction === "rtl";
  const { t } = useTranslation("orderDetails");
  const [selectedStatus, setSelectedStatus] = useState(
    order?.status || "pending"
  );
  const [anchorEl, setAnchorEl] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [error, setError] = useState(null);
  const [showRejectionInfo, setShowRejectionInfo] = useState(false);

  useEffect(() => {
    if (order) {
      setSelectedStatus(order.status);
      setRejectReason(order.reject_reason || "");
      setHasChanges(false);
      setError(null);
      setShowRejectionInfo(
        order.status === "rejected" && !!order.reject_reason
      );
    }
  }, [order]);

  if (!order) return null;

  const availableStatuses = getAvailableStatuses(order.status);
  const showRejectReason = selectedStatus === "rejected";

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setAnchorEl(null);
    setHasChanges(true);
    setError(null);
    if (status !== "rejected") {
      setRejectReason("");
    }
  };

  const handleSaveStatus = async () => {
    if (selectedStatus === "rejected" && !rejectReason.trim()) {
      setError(t("errors.rejectionReasonRequired"));
      return;
    }

    try {
      setError(null);
      await onStatusChange({
        orderId: order.id,
        newStatus: selectedStatus,
        currentStatus: order.status,
        rejectReason: selectedStatus === "rejected" ? rejectReason : null,
      });
    } catch (err) {
      setError(err.message || t("errors.statusUpdateFailed"));
    }
  };

  const hasValidChanges =
    hasChanges &&
    selectedStatus !== order.status &&
    (!showRejectReason || rejectReason.trim());

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle
        sx={{ backgroundColor: "#121212", color: "white", direction: "ltr" }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <Typography variant="h6">
              {t("title")} #{order.id}
            </Typography>
            <Chip
              label={t(`status.${order.status}`)}
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
        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* Rejection Info */}
        {showRejectionInfo && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="body1" fontWeight="bold">
              {t("rejection.reason")}
            </Typography>
            <Typography>{order.reject_reason}</Typography>
          </Alert>
        )}

        {/* Products Section */}
        <Box>
          <Typography variant="h6" gutterBottom>
            {t("sections.products")} {order.items.length}
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
                      {item.quantity} × $
                      {item.product_final_price || item.price}
                    </Typography>
                    <Box display="flex" justifyContent="space-between" mt={1.5}>
                      <Typography color="#aaa">
                        {t("fields.category")}
                      </Typography>
                      <Typography fontWeight="medium">
                        $
                        {(
                          item.quantity *
                          (item.product_final_price || item.price)
                        ).toFixed(2)}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Order Details Section */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            {t("sections.orderDetails")}
          </Typography>
          <Box sx={{ backgroundColor: "#292929", p: 3, borderRadius: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <DetailItem
                  label={t("fields.customerName")}
                  value={order.user?.name}
                />
                <DetailItem
                  label={t("fields.receiverName")}
                  value={order.reciver_name}
                />
                <DetailItem
                  label={t("fields.orderId")}
                  value={`#${order.id}`}
                />
                <DetailItem
                  label={t("fields.paymentCard")}
                  value={
                    order.card_number
                      ? `${order.card_number.slice(0, -4).replace(/./g, "•")}${order.card_number.slice(-4)}`
                      : "•••• •••• •••• ••••"
                  }
                />
                <DetailItem
                  label={t("fields.location")}
                  value={
                    order.lat && order.lon ? (
                      <Box display="flex" alignItems="center" gap={1}>
                        <Tooltip title={t("tooltips.viewOnMap")}>
                          <IconButton
                            size="small"
                            href={`https://maps.google.com/?q=${order.lat},${order.lon}`}
                            target="_blank"
                            sx={{ color: "#E4272B" }}
                          >
                            <LocationOnIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <CopyableLocation
                          location={`${parseFloat(order.lat).toFixed(6)}, ${parseFloat(order.lon).toFixed(6)}`}
                          copyText={t("buttons.copyCoordinates")}
                          copiedText={t("buttons.copied")}
                        />
                      </Box>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        {t("messages.locationNotAvailable")}
                      </Typography>
                    )
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <DetailItem
                  label={t("fields.customerEmail")}
                  value={order.user?.email}
                />
                <DetailItem
                  label={t("fields.receiverPhone")}
                  value={order.reciver_phone}
                />
                <DetailItem
                  label={t("fields.deliveryDate")}
                  value={
                    <span style={{ color: "#E4272B" }}>
                      {new Date(order.date).toLocaleString()}
                    </span>
                  }
                />
                <DetailItem
                  label={t("fields.totalPayment")}
                  value={`$${order.total_price}`}
                />
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Premium Service Section */}
        {order.user?.is_premium && (
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              <CrownIcon sx={{ color: "#E4272B", mr: 1, fontSize: 20 }} />
              {t("sections.premiumService")}
            </Typography>
            <Box sx={{ backgroundColor: "#292929", p: 3, borderRadius: 2 }}>
              <DetailItem
                label={t("fields.deliveryDate")}
                value={
                  <span style={{ color: "#E4272B" }}>
                    {new Date(order.date).toLocaleString()}
                  </span>
                }
              />
              <Box mt={2}>
                <Typography color="#aaa" gutterBottom>
                  {t("fields.attachments")}
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

        {/* Status Update Section */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            {t("sections.updateStatus")}
          </Typography>
          <Box
            sx={{
              backgroundColor: "#292929",
              p: 3,
              borderRadius: 2,
              direction: "ltr",
            }}
          >
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography color="#aaa" gutterBottom>
                  {t("fields.newStatus")}
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
                    {t(`status.${selectedStatus}`)}
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
                        {t(`status.${status}`)}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              </Grid>
              {showRejectReason && (
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={t("fields.rejectionReason")}
                    value={rejectReason}
                    onChange={(e) => {
                      setRejectReason(e.target.value);
                      setHasChanges(true);
                      setError(null);
                    }}
                    required
                    error={!!error}
                    sx={{
                      "& .MuiInputBase-root": { color: "white" },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#555" },
                        "&:hover fieldset": { borderColor: "#777" },
                        "&.Mui-focused fieldset": { borderColor: "#E4272B" },
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
          disabled={isUpdating}
          sx={{
            color: "white",
            borderColor: "#555",
            mr: isRTL ? 0 : 2,
            ml: isRTL ? 2 : 0,
          }}
        >
          {t("buttons.cancel")}
        </Button>
        <Button
          variant="contained"
          onClick={handleSaveStatus}
          disabled={!hasValidChanges || isUpdating}
          startIcon={isUpdating ? <CircularProgress size={20} /> : <SaveIcon />}
          sx={{
            backgroundColor: "#4CAF50",
            color: "white",
            "&:hover": { backgroundColor: "#3e8e41" },
            "& .MuiButton-startIcon": {
              marginLeft: isRTL ? "8px !important" : "0 !important",
              marginRight: isRTL ? "0 !important" : "8px !important",
            },
          }}
        >
          {isUpdating ? "" : t("buttons.saveChanges")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsModal;
