import React, { useEffect } from "react";
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
  Alert,
} from "@mui/material";

const ProductList = () => {
  const dispatch = useDispatch();
  const {
    data: products,
    status,
    error,
  } = useSelector((state) => state.products);

  // Fetch products on component mount
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Handle product deletion
  const handleDelete = async (id) => {
    await dispatch(deleteProduct(id));
    dispatch(fetchProducts()); // Re-fetch products after deletion
  };

  // Loading state
  if (status === "loading") {
    return <CircularProgress />;
  }

  // Error state
  if (status === "failed") {
    return <Alert severity="error">{error || "Failed to load products"}</Alert>;
  }

  // No products found
  if (products.length === 0) {
    return <Alert severity="info">No products found</Alert>;
  }

  // Render the table
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Description (EN)</TableCell>
            <TableCell>Description (AR)</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {products.map((product, index) => (
            <TableRow key={index}>
              <TableCell>{product.id}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.description?.en || "N/A"}</TableCell>
              <TableCell>{product.description?.ar || "N/A"}</TableCell>
              <TableCell>{product.price}</TableCell>
              <TableCell>{product.category?.name || "N/A"}</TableCell>
              <TableCell>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ProductList;
