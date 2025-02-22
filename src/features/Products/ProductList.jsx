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
  const { products, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteProduct(id)).then(() => {
      dispatch(fetchProducts());
    });
  };

  if (status === "loading") return <CircularProgress />; // Show loading indicator

  return (
    <div>
      {/* Handle error by showing an alert */}
      {status === "failed" && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Error: {error} {/* Display the error message */}
        </Alert>
      )}

      {/* Table to show products */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name (EN)</TableCell>
              <TableCell>Name (AR)</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Check if products are available */}
            {products?.data?.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name.en}</TableCell>
                <TableCell>{product.name.ar}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.category_id}</TableCell>
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
    </div>
  );
};

export default ProductList;
