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
} from "@mui/material";

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

  const sortedData = [...data].sort((a, b) => {
    if (orderBy) {
      const valueA = a[orderBy];
      const valueB = b[orderBy];

      if (orderBy === "payment") {
        const numA = parseFloat(valueA.replace("$", ""));
        const numB = parseFloat(valueB.replace("$", ""));
        return order === "asc" ? numA - numB : numB - numA;
      }

      if (orderBy === "cardNumber") {
        const numA = parseInt(valueA.split(" ").pop(), 10);
        const numB = parseInt(valueB.split(" ").pop(), 10);
        return order === "asc" ? numA - numB : numB - numA;
      }

      if (orderBy === "accountId") {
        const numA = parseInt(valueA.replace(/\D/g, ""), 10);
        const numB = parseInt(valueB.replace(/\D/g, ""), 10);
        return order === "asc" ? numA - numB : numB - numA;
      }

      if (typeof valueA === "number" && typeof valueB === "number") {
        return order === "asc" ? valueA - valueB : valueB - valueA;
      }

      if (typeof valueA === "string" && typeof valueB === "string") {
        return order === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (!isNaN(Date.parse(valueA)) && !isNaN(Date.parse(valueB))) {
        return order === "asc"
          ? new Date(valueA) - new Date(valueB)
          : new Date(valueB) - new Date(valueA);
      }

      if (typeof valueA === "boolean" && typeof valueB === "boolean") {
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
      }

      return 0;
    }
    return 0;
  });

  const paginatedData = sortedData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.field}>
                  {column.sortable ? (
                    <TableSortLabel
                      active={orderBy === column.field}
                      direction={orderBy === column.field ? order : "asc"}
                      onClick={() => handleSort(column.field)}
                    >
                      {column.headerName}
                    </TableSortLabel>
                  ) : (
                    column.headerName
                  )}
                </TableCell>
              ))}
              {actions && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <TableCell key={column.field}>{row[column.field]}</TableCell>
                ))}
                {actions && (
                  <TableCell>
                    {actions.map((action, actionIndex) => (
                      <Button
                        key={actionIndex}
                        variant="contained"
                        size="small"
                        onClick={() => action.onClick(row)}
                      >
                        {action.label}
                      </Button>
                    ))}
                  </TableCell>
                )}
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
    </Paper>
  );
}

export default CustomTable;
