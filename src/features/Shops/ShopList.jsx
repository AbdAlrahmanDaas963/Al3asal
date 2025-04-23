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
import ShopCard from "../../components/common/ShopCard";
import { fetchShops, syncShops } from "./shopSlice";
import { useTranslation } from "react-i18next";

const ShopList = () => {
  const { t } = useTranslation("shops");
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");

  const shopState = useSelector((state) => state.shops);
  const shops = shopState.data || shopState.shops?.data || [];
  const loading = shopState.status === "loading";
  const error = shopState.error;
  const lastFetched = shopState.lastFetched;
  const status = shopState.status;

  useEffect(() => {
    const timer = setTimeout(() => setSearchDebounced(searchQuery), 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dispatch(fetchShops());
        if (fetchShops.fulfilled.match(result)) {
          dispatch(syncShops(result.payload.data || result.payload));
        }
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };

    if (!lastFetched || Date.now() - lastFetched > 300000) {
      fetchData();
    }
  }, [dispatch, lastFetched]);

  const filteredShops = useMemo(() => {
    return shops
      .filter((shop) => {
        const shopName =
          typeof shop.name === "string"
            ? shop.name.toLowerCase()
            : shop.name?.en?.toLowerCase() ||
              shop.name?.ar?.toLowerCase() ||
              "";
        return shopName.includes(searchDebounced.toLowerCase());
      })
      .map((shop) => ({
        ...shop,
        image: shop.image?.startsWith("http") ? shop.image : "/placeholder.png",
      }));
  }, [shops, searchDebounced]);

  const loadingSkeletons = Array(6).fill(0);

  const handleRefresh = async () => {
    try {
      const result = await dispatch(fetchShops(true));
      if (fetchShops.fulfilled.match(result)) {
        dispatch(syncShops(result.payload.data || result.payload));
      }
    } catch (err) {
      console.error("Refresh error:", err);
    }
  };

  if (loading && (!lastFetched || shops.length === 0)) {
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
          {t("loadError", { error: error.message || error })}
        </Alert>
        <Button
          variant="contained"
          onClick={handleRefresh}
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
        {filteredShops.length > 0 ? (
          filteredShops.map((shop) => (
            <Grid item key={shop.id}>
              <ShopCard shop={shop} />
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
                {searchDebounced ? t("noMatchingShops") : t("noShops")}
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

export default ShopList;
