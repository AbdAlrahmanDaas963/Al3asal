import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Grid,
  CircularProgress,
  Typography,
  Box,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { fetchOffers } from "./offersSlice";
import OfferCard from "./OfferCard";

const OfferList = () => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: offers,
    loading,
    error,
  } = useSelector((state) => state.offers?.offers || {});

  useEffect(() => {
    dispatch(fetchOffers());
  }, [dispatch]);

  console.log("Offers Data:", offers); // Debugging log

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={200}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={200}
      >
        <Typography color="error">
          Failed to load offers. Please try again.
        </Typography>
      </Box>
    );
  }

  if (!offers || offers.length === 0) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height={200}
      >
        <Typography>No offers available.</Typography>
      </Box>
    );
  }

  const filteredOffers = offers.filter((offer) => {
    const searchLower = searchQuery.toLowerCase();

    // Handle nested structure: offer.product.name
    const productName = offer.product?.name
      ? offer.product.name.toLowerCase()
      : "";

    return productName.includes(searchLower);
  });

  return (
    <Box>
      {/* Search Bar */}
      <Box mb={2}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search for Offers"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            backgroundColor: "#333",
            borderRadius: "25px",
            input: { color: "#fff", padding: "12px" },
            "& .MuiOutlinedInput-root": {
              borderRadius: "25px",
              "& fieldset": { border: "1px solid #555" },
              "&:hover fieldset": { borderColor: "#888" },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "gray" }} />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Offers List */}
      <Grid container spacing={2} justifyContent="center">
        {filteredOffers.length > 0 ? (
          filteredOffers.map((offer) => (
            <Grid item key={offer.id}>
              <OfferCard offer={offer} />
            </Grid>
          ))
        ) : (
          <Typography>No matching offers found.</Typography>
        )}
      </Grid>
    </Box>
  );
};

export default OfferList;
