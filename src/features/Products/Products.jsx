import React from "react";
import { Link } from "react-router-dom";
import ProductList from "./ProductList";
import { Button, Typography, Container } from "@mui/material";

const Products = () => {
  return (
    <Container>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <Typography variant="h4" component="h1">
          Products
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/products/add"
        >
          Add Product
        </Button>
      </div>
      <ProductList />
    </Container>
  );
};

export default Products;
