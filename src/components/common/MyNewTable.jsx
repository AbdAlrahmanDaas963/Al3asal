import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Typography,
  TablePagination,
  TableSortLabel,
  Box,
} from "@mui/material";

import ShowRowDetails from "./Dialogs/reuse/popups/ShowRowDetails";

function CustomTable({
  title = "Table",
  columns,
  data,
  actions = null,
  rowsPerPageOptions = [5, 10, 25],
}) {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [filter, setFilter] = useState("all");
  // ?
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleDialogOpen = (row) => {
    setSelectedRow(row);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedRow(null);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedRows = [...data].sort((a, b) => {
    if (orderBy) {
      const valueA = a[orderBy];
      const valueB = b[orderBy];

      if (typeof valueA === "string" && typeof valueB === "string") {
        return order === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else if (typeof valueA === "number" && typeof valueB === "number") {
        return order === "asc" ? valueA - valueB : valueB - valueA;
      } else if (new Date(valueA) instanceof Date && !isNaN(new Date(valueA))) {
        return order === "asc"
          ? new Date(valueA) - new Date(valueB)
          : new Date(valueB) - new Date(valueA);
      } else {
        return 0;
      }
    }
    return 0;
  });
  const filteredRows =
    filter === "all"
      ? sortedRows
      : sortedRows.filter((row) => row.orderStatus === filter);

  const paginatedRows = filteredRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const statusColors = {
    pending: "orange",
    preparing: "blue",
    done: "green",
    failed: "#f00",
  };
  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {[
                { label: "Customer Name", key: "customerName" },
                { label: "Account ID", key: "accountId" },
                { label: "Category", key: "category" },
                { label: "Card Number", key: "cardNumber" },
                { label: "Deliver Date", key: "deliverDate" },
                { label: "Payment", key: "payment" },
                { label: "Premium Subscriber", key: "isPremium" },
              ].map((column) => (
                <TableCell
                  key={column.key}
                  sx={{
                    fontWeight: "bold",
                    color: "text.primary",
                    "&:hover": {
                      color: "primary.main",
                    },
                  }}
                >
                  <TableSortLabel
                    active={orderBy === column.key}
                    direction={orderBy === column.key ? order : "asc"}
                    onClick={() => handleSort(column.key)}
                    sx={{
                      "& .MuiTableSortLabel-icon": {
                        opacity: 0,
                      },
                      "&:hover .MuiTableSortLabel-icon": {
                        opacity: 1,
                      },
                    }}
                  >
                    {column.label}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: "bold", color: "text.primary" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedRows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Box display="flex" alignItems="center">
                    <Box
                      sx={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        backgroundColor: statusColors[row.orderStatus],
                        marginRight: 1,
                      }}
                    />
                    {row.customerName}
                  </Box>
                </TableCell>
                <TableCell>{row.accountId}</TableCell>
                <TableCell>{row.category}</TableCell>
                <TableCell>{row.cardNumber}</TableCell>
                <TableCell>{row.deliverDate}</TableCell>
                <TableCell>{row.payment}</TableCell>
                <TableCell>{row.isPremium ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleDialogOpen(row)}
                  >
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={rowsPerPageOptions}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {selectedRow && (
        <ShowRowDetails
          open={dialogOpen}
          handleClose={handleDialogClose}
          onSubmit={(formData) => console.log("Form Submitted:", formData)}
          data={selectedRow} // Pass row data to the dialog
        />
      )}
    </Paper>
  );
}

export default CustomTable;
