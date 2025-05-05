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
  TextField,
  InputAdornment,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageContext } from "../../contexts/LanguageContext";
import SearchIcon from "@mui/icons-material/Search";

const DescriptionCell = ({ description, language }) => {
  const desc =
    description?.[language] ||
    description?.en ||
    t("products.table.notAvailable");
  return (
    <Tooltip title={desc} enterDelay={500} arrow>
      <Typography
        sx={{
          maxWidth: "200px",
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {desc}
      </Typography>
    </Tooltip>
  );
};

const ProductList = () => {
  const { t } = useTranslation("products");
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.data || []);
  const status = useSelector((state) => state.products.status);
  const error = useSelector((state) => state.products.error);

  const NameCell = ({ name, language }) => {
    const productName =
      name?.[language] || name?.en || name || t("products.table.notAvailable");
    return (
      <Tooltip title={productName} enterDelay={500} arrow>
        <Typography
          sx={{
            maxWidth: "150px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {productName}
        </Typography>
      </Tooltip>
    );
  };

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");

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

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(searchQuery);
      setPage(0); // Reset to first page when search changes
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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

  // Filter products based on search query
  const filteredProducts = products.filter((product) => {
    if (!searchDebounced) return true;

    const searchLower = searchDebounced.toLowerCase();

    // Search in name (all languages)
    const nameMatch = Object.values(product.name || {}).some(
      (name) => name && name.toLowerCase().includes(searchLower)
    );

    // Search in description (all languages)
    const descMatch = Object.values(product.description || {}).some(
      (desc) => desc && desc.toLowerCase().includes(searchLower)
    );

    // Search in price
    const priceMatch = product.price?.toString().includes(searchLower);

    // Search in shop name (all languages)
    const shopMatch = Object.values(product.shop?.name || {}).some(
      (name) => name && name.toLowerCase().includes(searchLower)
    );

    // Search in category name (all languages)
    const categoryMatch = Object.values(product.category?.name || {}).some(
      (name) => name && name.toLowerCase().includes(searchLower)
    );

    return nameMatch || descMatch || priceMatch || shopMatch || categoryMatch;
  });

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

      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t("products.searchPlaceholder") || "Search products..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            backgroundColor: "#333",
            borderRadius: "25px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "25px",
              "& fieldset": { borderColor: "#555" },
              "&:hover fieldset": { borderColor: "#888" },
            },
            input: { color: "#fff", padding: "12px" },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" sx={{ color: "gray" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="products table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: "80px" }}>
                {t("products.table.headers.id")}
              </TableCell>
              <TableCell sx={{ width: "180px" }}>
                {t("products.table.headers.name")}
              </TableCell>
              <TableCell sx={{ width: "220px" }}>
                {t("products.table.headers.description")}
              </TableCell>
              <TableCell sx={{ width: "100px" }}>
                {t("products.table.headers.price")}
              </TableCell>
              <TableCell sx={{ width: "120px" }}>
                {t("products.table.headers.shop")}
              </TableCell>
              <TableCell sx={{ width: "120px" }}>
                {t("products.table.headers.category")}
              </TableCell>
              <TableCell sx={{ width: "180px" }}>
                {t("products.table.headers.actions")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {status === "loading" && products.length === 0
              ? Array.from({ length: rowsPerPage }).map((_, index) => (
                  <SkeletonRow key={`skeleton-${index}`} />
                ))
              : filteredProducts
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((product, index) => (
                    <TableRow key={`${product.id}-${index}`}>
                      <TableCell sx={{ width: "80px" }}>{product.id}</TableCell>
                      <TableCell sx={{ width: "180px" }}>
                        <NameCell name={product.name} language={language} />
                      </TableCell>
                      <TableCell sx={{ width: "220px" }}>
                        <DescriptionCell
                          description={product.description}
                          language={language}
                        />
                      </TableCell>
                      <TableCell sx={{ width: "100px" }}>
                        {product.price || t("products.table.notAvailable")}
                      </TableCell>
                      <TableCell sx={{ width: "120px" }}>
                        {product.shop?.name?.[language] ||
                          product.shop?.name?.en ||
                          product.shop?.name ||
                          t("products.table.notAvailable")}
                      </TableCell>
                      <TableCell sx={{ width: "120px" }}>
                        {product.category?.name?.[language] ||
                          product.category?.name?.en ||
                          product.category?.name ||
                          t("products.table.notAvailable")}
                      </TableCell>
                      <TableCell sx={{ width: "180px" }}>
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
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      {filteredProducts.length === 0 && searchDebounced && (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="200px"
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {t("products.noMatchingProducts") ||
              "No products match your search"}
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setSearchQuery("")}
            sx={{ mt: 2 }}
          >
            {t("products.clearSearch") || "Clear search"}
          </Button>
        </Box>
      )}
    </>
  );
};

export default ProductList;
