import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "./productsSlice";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Alert,
  Box,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.data || []);
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);

  // Delete confirmation state
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteProduct(productToDelete)).unwrap();
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const handleEditClick = (product) => {
    navigate(`/dashboard/products/edit/${product.id}`, { state: { product } });
  };

  // Loading state - only show when there are no products yet
  if (status === "loading" && products.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (status === "failed") {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error || "Failed to load products"}
        <Button
          variant="outlined"
          onClick={() => dispatch(fetchProducts())}
          sx={{ ml: 2 }}
        >
          Retry
        </Button>
      </Alert>
    );
  }

  // Empty state
  if (products.length === 0 && status === "succeeded") {
    return (
      <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
        <Alert severity="info">No products found</Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/dashboard/products/add")}
        >
          Create New Product
        </Button>
      </Stack>
    );
  }

  return (
    <>
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this product? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description (AR)</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Shop</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product, index) => (
                <TableRow key={index}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>
                    {product.name?.ar ||
                      product.name?.en ||
                      product.name ||
                      "N/A"}
                  </TableCell>
                  <TableCell>
                    {product.description?.ar ||
                      product.description?.en ||
                      "N/A"}
                  </TableCell>
                  <TableCell>{product.price || "N/A"}</TableCell>
                  <TableCell>
                    {product.shop?.name?.ar ||
                      product.shop?.name?.en ||
                      product.shop?.name ||
                      "N/A"}
                  </TableCell>
                  <TableCell>
                    {product.category?.name?.ar ||
                      product.category?.name?.en ||
                      product.category?.name ||
                      "N/A"}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => handleEditClick(product)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
                        onClick={() => handleDeleteClick(product.id)}
                      >
                        Delete
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={products.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>
    </>
  );
};

export default ProductList;
