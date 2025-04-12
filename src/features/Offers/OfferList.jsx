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

const OfferList = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");

  // Redux state with better default values
  const {
    data: offers = [],
    loading = false,
    error = null,
    lastFetched = null,
  } = useSelector((state) => state.offers?.offers || {});

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch offers with cache validation
  useEffect(() => {
    const shouldFetch = !lastFetched || Date.now() - lastFetched > 300000; // 5 minute cache
    if (shouldFetch) {
      dispatch(fetchOffers());
    }
  }, [dispatch, lastFetched]);

  const filteredOffers = useMemo(() => {
    if (!searchDebounced) return offers;

    const searchLower = searchDebounced.toLowerCase();
    return offers.filter((offer) => {
      // Safely handle product name (null/undefined/object cases)
      const productName =
        typeof offer.product?.name === "string"
          ? offer.product.name.toLowerCase()
          : "";

      // Safely handle description (null/undefined/object cases)
      const description =
        typeof offer.product?.description === "string"
          ? offer.product.description.toLowerCase()
          : "";

      return (
        productName.includes(searchLower) || description.includes(searchLower)
      );
    });
  }, [offers, searchDebounced]);

  // Loading skeleton array
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
          Failed to load offers: {error.message || "Unknown error"}
        </Alert>
        <Button
          variant="contained"
          onClick={() => dispatch(fetchOffers())}
          startIcon={<RefreshIcon />}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      {/* Search Bar */}
      <Box mb={3}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search offers by name or description"
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

      {/* Offers List */}
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
            {searchDebounced
              ? "No matching offers found"
              : "No offers available"}
          </Typography>
          {searchDebounced && (
            <Button
              variant="outlined"
              onClick={() => setSearchQuery("")}
              sx={{ mt: 2 }}
            >
              Clear search
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
};

export default OfferList;
