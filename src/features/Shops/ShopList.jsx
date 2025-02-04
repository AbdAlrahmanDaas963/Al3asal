import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { deleteShop } from "./shopSlice";
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
} from "@mui/material";

const ShopList = ({ shops, status, error }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this shop?")) {
      dispatch(deleteShop(id));
    }
  };

  if (status === "loading") {
    return <Typography variant="body1">Loading shops...</Typography>;
  }

  if (status === "failed") {
    return (
      <Typography variant="body1" color="error">
        Error: {error}
      </Typography>
    );
  }

  if (!shops?.data || shops.data.length === 0) {
    return <Typography variant="body1">No shops available.</Typography>;
  }

  return (
    <Grid container spacing={3}>
      {shops.data.map((shop) => (
        <Grid item key={shop.id} xs={12} sm={6} md={4}>
          <Card>
            <CardMedia
              component="img"
              height="140"
              image={shop.image || "https://via.placeholder.com/150"}
              alt={shop.name}
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/150";
              }}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {shop.name}
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate(`/dashboard/shops/edit/${shop.id}`)}
                sx={{ mr: 2 }}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleDelete(shop.id)}
              >
                Delete
              </Button>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default ShopList;
