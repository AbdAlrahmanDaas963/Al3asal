import React, { useState } from "react";
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
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const statusColors = {
  done: "green",
  pending: "yellow",
  failed: "red",
  preparing: "orange",
  default: "gray",
};

const statusFilters = ["all", "pending", "preparing", "done", "failed"];

const OrdersTable = ({ orders }) => {
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(0);
  const rowsPerPage = 8; // Fixed rows per page like the image

  // Handle filtering by status
  const filteredOrders =
    status === "all"
      ? orders
      : orders.filter((order) => order.status === status);

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  // Handle pagination
  const handlePrevious = () => {
    if (page > 0) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  return (
    <Box sx={{ backgroundColor: "#121212", p: 2, borderRadius: 2 }}>
      {/* Tabs for Filtering */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Tabs
          value={statusFilters.indexOf(status)}
          onChange={(_, newStatus) => setStatus(statusFilters[newStatus])}
          textColor="primary"
          indicatorColor="primary"
        >
          {statusFilters.map((s) => (
            <Tab key={s} label={s.charAt(0).toUpperCase() + s.slice(1)} />
          ))}
        </Tabs>
        <IconButton>
          <FilterListIcon color="primary" />
        </IconButton>
      </Box>

      {/* Orders Table */}
      <TableContainer
        component={Paper}
        sx={{ backgroundColor: "#121212", mt: 2 }}
      >
        <Table>
          {/* Table Head */}
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Customer Name</TableCell>
              <TableCell sx={{ color: "white" }}>Account ID</TableCell>
              <TableCell sx={{ color: "white" }}>Category</TableCell>
              <TableCell sx={{ color: "white" }}>Card</TableCell>
              <TableCell sx={{ color: "white" }}>Deliver Date</TableCell>
              <TableCell sx={{ color: "white" }}>Payment</TableCell>
              <TableCell sx={{ color: "white" }}>Actions</TableCell>
            </TableRow>
          </TableHead>

          {/* Table Body */}
          <TableBody>
            {filteredOrders
              .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
              .map((order, index) => (
                <TableRow key={index}>
                  {/* Status Indicator + Customer Name */}
                  <TableCell>
                    <Box display="flex" alignItems="center">
                      {/* Status Indicator */}
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: "50%",
                          bgcolor:
                            statusColors[order.status] || statusColors.default,
                          mr: 1,
                        }}
                      />
                      <Typography color="white">
                        {order.reciver_name || "N/A"}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Account ID */}
                  <TableCell sx={{ color: "white" }}>#{order.id}</TableCell>

                  {/* Category */}
                  <TableCell sx={{ color: "white" }}>
                    {order.category || "N/A"}
                  </TableCell>

                  {/* Card */}
                  <TableCell sx={{ color: "white" }}>****</TableCell>

                  {/* Delivery Date */}
                  <TableCell sx={{ color: "white" }}>
                    {new Date(order.date).toLocaleString()}
                  </TableCell>

                  {/* Payment */}
                  <TableCell sx={{ color: "white" }}>
                    ${order.total_price || 0}
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <Button
                      variant={index === 0 ? "contained" : "outlined"}
                      color="primary"
                      sx={{ ml: 1 }}
                    >
                      Detail
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Custom Pagination Controls */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ mt: 2, color: "white" }}
      >
        {/* Previous Button */}
        <IconButton onClick={handlePrevious} disabled={page === 0}>
          <ArrowBackIosIcon sx={{ color: page === 0 ? "gray" : "white" }} />
        </IconButton>

        {/* Page Numbers */}
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            variant={i === page ? "contained" : "text"}
            sx={{
              mx: 0.5,
              minWidth: 30,
              color: i === page ? "white" : "#ccc",
              backgroundColor: i === page ? "#E4272B" : "transparent",
              "&:hover": {
                backgroundColor: i === page ? "#E4272B" : "#292929",
              },
            }}
            onClick={() => setPage(i)}
          >
            {i + 1}
          </Button>
        ))}

        {/* Next Button */}
        <IconButton onClick={handleNext} disabled={page === totalPages - 1}>
          <ArrowForwardIosIcon
            sx={{ color: page === totalPages - 1 ? "gray" : "white" }}
          />
        </IconButton>
      </Box>
    </Box>
  );
};

export default OrdersTable;
