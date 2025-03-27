import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "./productsSlice";
import {
  Button,
  CircularProgress,
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    data: products,
    status,
    error,
  } = useSelector((state) => state.products);

  // Delete confirmation dialog state
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch products on component mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handle delete confirmation
  const handleDeleteClick = (id) => {
    setProductToDelete(id);
    setOpenDeleteDialog(true);
  };

  // Handle confirmed deletion
  const handleDelete = async () => {
    try {
      await dispatch(deleteProduct(productToDelete)).unwrap();
      setOpenDeleteDialog(false);
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  // Memoized paginated products
  const visibleProducts = useMemo(() => {
    return products.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [products, page, rowsPerPage]);

  // Loading state
  if (status === "loading" && products.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state
  if (status === "failed") {
    return <Alert severity="error">{error || "Failed to load products"}</Alert>;
  }

  // Empty state
  if (products.length === 0 && status === "succeeded") {
    return (
      <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
        <Alert severity="info">No products found</Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/dashboard/products/create")}
        >
          Create New Product
        </Button>
      </Stack>
    );
  }

  return (
    <>
      {/* Delete Confirmation Dialog */}
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

      {/* Products Table */}
      <TableContainer
        component={Paper}
        sx={{ maxWidth: "100%", overflowX: "auto" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description (EN)</TableCell>
              <TableCell>Description (AR)</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Shop Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleProducts.map((product, index) => (
              <TableRow key={index}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description?.en || "N/A"}</TableCell>
                <TableCell>{product.description?.ar || "N/A"}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>
                  {product.category?.shops[0]?.name || "N/A"}
                </TableCell>
                <TableCell>{product.category?.name || "N/A"}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() =>
                        navigate(`/dashboard/products/edit/${product.id}`, {
                          state: { product },
                        })
                      }
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
