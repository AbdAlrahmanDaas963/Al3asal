import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Grid,
  Typography,
  TextField,
  InputAdornment,
  Alert,
  Skeleton,
  Button,
  Box,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import CategoryCard from "../../components/common/CategoryCard";
import { fetchCategories } from "./categorySlice";
import { useTranslation } from "react-i18next";

const CategoryList = () => {
  const { t } = useTranslation("categories");
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");

  const {
    data: categories = [],
    loading,
    error,
    lastFetched,
    status,
  } = useSelector((state) => ({
    data: state.categories.data || state.categories.categories || [],
    loading: state.categories.status === "loading",
    error: state.categories.error,
    lastFetched: state.categories.lastFetched,
    status: state.categories.status,
  }));

  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!lastFetched || Date.now() - lastFetched > 300000) {
      dispatch(fetchCategories());
    }
  }, [dispatch, lastFetched]);

  const filteredCategories = useMemo(() => {
    if (!searchDebounced) return categories;

    const searchLower = searchDebounced.toLowerCase();
    return categories.filter((category) => {
      const name =
        typeof category.name === "string"
          ? category.name.toLowerCase()
          : category.name?.en?.toLowerCase() ||
            category.name?.ar?.toLowerCase() ||
            "";
      return name.includes(searchLower);
    });
  }, [categories, searchDebounced]);

  const loadingSkeletons = Array(6).fill(0);

  if (status === "loading" && (!lastFetched || categories.length === 0)) {
    return (
      <Box sx={{ p: 3 }}>
        <Skeleton
          variant="rounded"
          width="100%"
          height={56}
          sx={{ mb: 3, borderRadius: "25px" }}
        />
        <Grid container spacing={3}>
          {loadingSkeletons.map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={`skeleton-${index}`}>
              <Skeleton
                variant="rounded"
                width="100%"
                height={200}
                sx={{ borderRadius: "16px" }}
              />
              <Box sx={{ pt: 1.5 }}>
                <Skeleton width="80%" height={28} />
                <Skeleton width="60%" height={20} />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: "center" }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {t("loadError", { error })}
        </Alert>
        <Button
          variant="contained"
          onClick={() => dispatch(fetchCategories())}
          startIcon={<RefreshIcon />}
        >
          {t("retry")}
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder={t("searchPlaceholder")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          mb: 3,
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
              <SearchIcon sx={{ color: "gray" }} />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={3}>
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category) => (
            <Grid item key={category.id}>
              <CategoryCard category={category} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              minHeight="200px"
            >
              <Typography variant="h6" color="textSecondary">
                {searchDebounced
                  ? t("noMatchingCategories")
                  : t("noCategories")}
              </Typography>
              {searchDebounced && (
                <Button
                  variant="outlined"
                  onClick={() => setSearchQuery("")}
                  sx={{ mt: 2 }}
                >
                  {t("clearSearch")}
                </Button>
              )}
            </Box>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default CategoryList;
