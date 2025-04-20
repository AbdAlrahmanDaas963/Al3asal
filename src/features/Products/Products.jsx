import React from "react";
import { Link } from "react-router-dom";
import ProductList from "./ProductList";
import { Button, Typography, Container } from "@mui/material";
import { useTranslation } from "react-i18next";

const Products = () => {
  const { t } = useTranslation("products");

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
          {t("products.title")}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/dashboard/products/add"
        >
          {t("products.addButton")}
        </Button>
      </div>
      <ProductList />
    </Container>
  );
};

export default Products;
