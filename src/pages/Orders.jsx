import React, { useState } from "react";
import MyTable from "../components/MyTable";

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
} from "@mui/material";

const rows = Array.from({ length: 50 }, (_, index) => ({
  customerName: `Customer ${index + 1}`,
  accountId: `ID${index + 1}`,
  category: index % 2 === 0 ? "Gold" : "Silver",
  cardNumber: `**** **** **** ${1000 + index}`,
  deliverDate: `2024-12-${(index % 30) + 1}`,
  payment: (index + 1) * 10,
  isPremium: index % 3 === 0,
}));

function Orders() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");

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

  const sortedRows = [...rows].sort((a, b) => {
    if (orderBy) {
      const valueA = a[orderBy];
      const valueB = b[orderBy];

      if (typeof valueA === "string" && typeof valueB === "string") {
        return order === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else if (typeof valueA === "number" && typeof valueB === "number") {
        return order === "asc" ? valueA - valueB : valueB - valueA;
      } else if (!isNaN(Date.parse(valueA)) && !isNaN(Date.parse(valueB))) {
        // Date comparison
        return order === "asc"
          ? new Date(valueA) - new Date(valueB)
          : new Date(valueB) - new Date(valueA);
      } else if (typeof valueA === "boolean" && typeof valueB === "boolean") {
        return order === "asc"
          ? valueA === valueB
            ? 0
            : valueA
              ? -1
              : 1
          : valueA === valueB
            ? 0
            : valueA
              ? 1
              : -1;
      } else {
        return 0;
      }
    }
    return 0;
  });

  const paginatedRows = sortedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div>
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="h6" gutterBottom>
          Customer Details
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "customerName"}
                    direction={orderBy === "customerName" ? order : "asc"}
                    onClick={() => handleSort("customerName")}
                  >
                    Customer Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "accountId"}
                    direction={orderBy === "accountId" ? order : "asc"}
                    onClick={() => handleSort("accountId")}
                  >
                    Account ID
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "category"}
                    direction={orderBy === "category" ? order : "asc"}
                    onClick={() => handleSort("category")}
                  >
                    Category
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "cardNumber"}
                    direction={orderBy === "cardNumber" ? order : "asc"}
                    onClick={() => handleSort("cardNumber")}
                  >
                    Card Number
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "deliverDate"}
                    direction={orderBy === "deliverDate" ? order : "asc"}
                    onClick={() => handleSort("deliverDate")}
                  >
                    Deliver Date
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "payment"}
                    direction={orderBy === "payment" ? order : "asc"}
                    onClick={() => handleSort("payment")}
                  >
                    Payment
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === "isPremium"}
                    direction={orderBy === "isPremium" ? order : "asc"}
                    onClick={() => handleSort("isPremium")}
                  >
                    Premium Subscriber
                  </TableSortLabel>
                </TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedRows.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.customerName}</TableCell>
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
                      onClick={() => alert(`Details of ${row.customerName}`)}
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
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={sortedRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

export default Orders;
