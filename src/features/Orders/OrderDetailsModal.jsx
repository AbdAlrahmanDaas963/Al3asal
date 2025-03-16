import React from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CrownIcon from "@mui/icons-material/EmojiEvents";

const statusColors = {
  done: "#4CAF50",
  pending: "#FFC107",
  failed: "#F44336",
  preparing: "#FF9800",
  default: "#9E9E9E",
};

const OrderDetailsModal = ({ order, open, handleClose }) => {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          backgroundColor: "#121212",
          color: "white",
        }}
      >
        Order Details
        <IconButton onClick={handleClose}>
          <CloseIcon sx={{ color: "white" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{ backgroundColor: "#121212", color: "white" }}
      >
        {/* Products Section */}
        <Typography variant="h6" gutterBottom>
          Products
        </Typography>
        <Grid container spacing={2}>
          {order.items.map((item, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Card
                sx={{
                  backgroundColor: "#292929",
                  color: "white",
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Typography variant="body1">{item.product_name}</Typography>
                  <Typography variant="body2">
                    Amount: {item.quantity}
                  </Typography>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={1}
                  >
                    <Typography variant="h6">${item.product_price}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Order Details Section */}
        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          Order Detail
        </Typography>
        <Box sx={{ backgroundColor: "#292929", p: 2, borderRadius: 2 }}>
          <Grid container spacing={2}>
            {/* Left Column */}
            <Grid item xs={12} sm={6}>
              <Typography>
                <b>Customer Name:</b> {order.user.name}
              </Typography>
              <Typography>
                <b>Receiver Name:</b> {order.reciver_name}
              </Typography>
              <Typography>
                <b>ID:</b> #{order.id}
              </Typography>
              <Typography>
                <b>Card:</b> **** **** **** 1234
              </Typography>
              <Typography>
                <b>Location:</b> 54.5461, 71.5149{" "}
                <LocationOnIcon
                  sx={{ fontSize: 16, verticalAlign: "middle" }}
                />
              </Typography>
              <Box display="flex" alignItems="center">
                <Typography sx={{ mr: 1 }}>
                  <b>Status:</b>
                </Typography>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0.5,
                  }}
                >
                  <Box
                    sx={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      backgroundColor:
                        statusColors[order.status] || statusColors.default,
                    }}
                  />
                  <Typography>
                    {order.status.charAt(0).toUpperCase() +
                      order.status.slice(1)}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Right Column */}
            <Grid item xs={12} sm={6}>
              <Typography>
                <b>Customer Number:</b> {order.user.email}
              </Typography>
              <Typography>
                <b>Receiver Number:</b> {order.reciver_phone}
              </Typography>
              <Typography>
                <b>Deliver Date:</b>
                <span style={{ color: "#E4272B" }}>
                  {new Date(order.date).toLocaleString()}
                </span>
              </Typography>
              <Typography>
                <b>Payment:</b> ${order.total_price}
              </Typography>
              <Typography>
                <b>Category:</b> {order.category}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Premium Service Section */}
        <Box sx={{ backgroundColor: "#292929", p: 2, borderRadius: 2, mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            <CrownIcon sx={{ color: "#E4272B", mr: 1, fontSize: 20 }} />
            Premium Service
          </Typography>
          <Typography>
            <b>Deliver Date:</b>{" "}
            <span style={{ color: "#E4272B" }}>
              {new Date(order.date).toLocaleString()}
            </span>
          </Typography>

          {/* Files Section */}
          <Typography sx={{ mt: 1 }}>Files:</Typography>
          <Box display="flex" gap={1} mt={1}>
            <Box
              sx={{
                width: 40,
                height: 40,
                backgroundColor: "#414141",
                borderRadius: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              📷
            </Box>
            <Box
              sx={{
                width: 40,
                height: 40,
                backgroundColor: "#414141",
                borderRadius: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              📷
            </Box>
            <Box
              sx={{
                width: 40,
                height: 40,
                backgroundColor: "#414141",
                borderRadius: 1,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              📷
            </Box>
          </Box>

          {/* Notes Section */}
          <Typography sx={{ mt: 2 }}>Notes:</Typography>
          <Box
            sx={{
              backgroundColor: "#414141",
              color: "#ccc",
              p: 1,
              borderRadius: 1,
              mt: 1,
            }}
          >
            Vel excepturi ut culpa corporis mollitia. Quibusdam accusamus velit
            quod maiores rem.
          </Box>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions sx={{ backgroundColor: "#121212" }}>
        <Button
          variant="contained"
          color="error"
          onClick={handleClose}
          sx={{ borderRadius: 2, fontSize: 16, px: 4 }}
        >
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailsModal;
