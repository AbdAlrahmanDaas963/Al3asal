import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Grid, CircularProgress, Typography, Box } from "@mui/material";
import { fetchOffers } from "./offersSlice";
import OfferCard from "./OfferCard";

const OfferList = () => {
  const dispatch = useDispatch();
  const {
    data: offers,
    loading,
    error,
  } = useSelector((state) => state.offers?.offers || {});

  useEffect(() => {
    dispatch(fetchOffers());
  }, [dispatch]);

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

  return (
    <Grid container spacing={2} justifyContent="center">
      {offers.map((offer) => (
        <Grid item key={offer.id}>
          <OfferCard offer={offer} />
        </Grid>
      ))}
    </Grid>
  );
};

export default OfferList;
