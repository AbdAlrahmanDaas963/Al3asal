import React, { useEffect, useState, useContext } from "react";
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
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TablePagination,
  Skeleton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../contexts/LanguageContext";

const ProductList = () => {
  const { t } = useTranslation("products");
  const { language } = useContext(LanguageContext);
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

  // Improved Skeleton Loader
  const SkeletonRow = () => (
    <TableRow>
      <TableCell>
        <Skeleton variant="text" />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" />
      </TableCell>
      <TableCell>
        <Stack direction="row" spacing={1}>
          <Skeleton variant="rectangular" width={60} height={30} />
          <Skeleton variant="rectangular" width={60} height={30} />
        </Stack>
      </TableCell>
    </TableRow>
  );

  // Error state
  if (status === "failed") {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error || t("products.errors.loadFailed")}
        <Button
          variant="outlined"
          onClick={() => dispatch(fetchProducts())}
          sx={{ ml: 2 }}
        >
          {t("products.errors.retry")}
        </Button>
      </Alert>
    );
  }

  // Empty state
  if (products.length === 0 && status === "succeeded") {
    return (
      <Stack spacing={2} alignItems="center" sx={{ mt: 4 }}>
        <Alert severity="info">{t("products.emptyState.message")}</Alert>
        <Button
          variant="contained"
          onClick={() => navigate("/dashboard/products/add")}
        >
          {t("products.emptyState.createButton")}
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
        <DialogTitle>{t("products.deleteDialog.title")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("products.deleteDialog.message")}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>
            {t("products.deleteDialog.cancel")}
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            {t("products.deleteDialog.confirm")}
          </Button>
        </DialogActions>
      </Dialog>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{t("products.table.headers.id")}</TableCell>
              <TableCell>{t("products.table.headers.name")}</TableCell>
              <TableCell>{t("products.table.headers.description")}</TableCell>
              <TableCell>{t("products.table.headers.price")}</TableCell>
              <TableCell>{t("products.table.headers.shop")}</TableCell>
              <TableCell>{t("products.table.headers.category")}</TableCell>
              <TableCell>{t("products.table.headers.actions")}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {status === "loading" && products.length === 0
              ? Array.from({ length: rowsPerPage }).map((_, index) => (
                  <SkeletonRow key={`skeleton-${index}`} />
                ))
              : products
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((product, index) => (
                    <TableRow key={`${product.id}-${index}`}>
                      <TableCell>{product.id}</TableCell>
                      <TableCell>
                        {product.name?.[language] ||
                          product.name?.en ||
                          product.name ||
                          t("products.table.notAvailable")}
                      </TableCell>
                      <TableCell>
                        {product.description?.[language] ||
                          product.description?.en ||
                          t("products.table.notAvailable")}
                      </TableCell>
                      <TableCell>
                        {product.price || t("products.table.notAvailable")}
                      </TableCell>
                      <TableCell>
                        {product.shop?.name?.[language] ||
                          product.shop?.name?.en ||
                          product.shop?.name ||
                          t("products.table.notAvailable")}
                      </TableCell>
                      <TableCell>
                        {product.category?.name?.[language] ||
                          product.category?.name?.en ||
                          product.category?.name ||
                          t("products.table.notAvailable")}
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleEditClick(product)}
                          >
                            {t("products.table.actions.edit")}
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            onClick={() => handleDeleteClick(product.id)}
                          >
                            {t("products.table.actions.delete")}
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
          onPageChange={(_, newPage) => setPage(newPage)}
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
