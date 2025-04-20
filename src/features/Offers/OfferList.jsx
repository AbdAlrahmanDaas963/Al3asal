import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Grid,
  CircularProgress,
  Typography,
  Box,
  TextField,
  InputAdornment,
  Alert,
  Skeleton,
  Button,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import SearchIcon from "@mui/icons-material/Search";
import { fetchOffers } from "./offersSlice";
import OfferCard from "./OfferCard";
import { useTranslation } from "react-i18next";

const OfferList = () => {
  const { t } = useTranslation("offers");
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");

  const {
    data: offers = [],
    loading = false,
    error = null,
    lastFetched = null,
  } = useSelector((state) => state.offers?.offers || {});

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const shouldFetch = !lastFetched || Date.now() - lastFetched > 300000;
    if (shouldFetch) {
      dispatch(fetchOffers());
    }
  }, [dispatch, lastFetched]);

  const filteredOffers = useMemo(() => {
    if (!searchDebounced) return offers;

    const searchLower = searchDebounced.toLowerCase();
    return offers.filter((offer) => {
      const productName =
        typeof offer.product?.name === "string"
          ? offer.product.name.toLowerCase()
          : "";

      const description =
        typeof offer.product?.description === "string"
          ? offer.product.description.toLowerCase()
          : "";

      return (
        productName.includes(searchLower) || description.includes(searchLower)
      );
    });
  }, [offers, searchDebounced]);

  const loadingSkeletons = Array(6).fill(0);

  if (loading && offers.length === 0) {
    return (
      <Box>
        <Box mb={2}>
          <Skeleton
            variant="rounded"
            width="100%"
            height={56}
            sx={{ borderRadius: "25px" }}
          />
        </Box>
        <Grid container spacing={2} justifyContent="center">
          {loadingSkeletons.map((_, index) => (
            <Grid item key={`skeleton-${index}`}>
              <Skeleton
                variant="rounded"
                width={280}
                height={360}
                sx={{ borderRadius: "16px" }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }
  if (error) {
    return (
      <Box mt={4}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {t("loadError", { error: error.message || "Unknown error" })}
        </Alert>
        <Button
          variant="contained"
          onClick={() => dispatch(fetchOffers())}
          startIcon={<RefreshIcon />}
        >
          {t("retry")}
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box mb={3}>
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
                <SearchIcon color="action" sx={{ color: "gray" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {filteredOffers.length > 0 ? (
        <Grid container spacing={3} justifyContent="center">
          {filteredOffers.map((offer) => (
            <Grid item key={offer.id}>
              <OfferCard offer={offer} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          minHeight="300px"
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchDebounced ? t("noMatchingOffers") : t("noOffers")}
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
      )}
    </Box>
  );
};

export default OfferList;
