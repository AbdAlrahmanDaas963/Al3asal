import React, { useState, useMemo } from "react";
import {
  Stack,
  Typography,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ProductCard from "../../components/common/ProdcutCard";

const ShopList = ({ shops, status, error }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Handle loading state
  if (status === "loading") {
    return (
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{ height: "200px" }}
      >
        <CircularProgress />
      </Stack>
    );
  }

  // Handle error state
  if (status === "failed") {
    return (
      <Typography variant="body1" color="error" align="center">
        Error: {typeof error === "string" ? error : JSON.stringify(error)}
      </Typography>
    );
  }

  // Handle empty state
  if (!Array.isArray(shops?.data) || shops.data.length === 0) {
    return (
      <Typography variant="body1" align="center">
        No shops available.
      </Typography>
    );
  }

  // Filter shops based on search query and remove broken images
  const filteredShops = useMemo(() => {
    return shops.data
      .filter((shop) => {
        const shopName =
          typeof shop.name === "string"
            ? shop.name
            : shop.name?.en || shop.name?.ar || "";
        return shopName.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .map((shop) => ({
        ...shop,
        image:
          shop.image && shop.image.startsWith("http")
            ? shop.image
            : "/placeholder.png", // Use placeholder if URL is broken
      }));
  }, [shops.data, searchQuery]);

  return (
    <Stack
      spacing={3}
      sx={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}
    >
      {/* Search Field */}
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search for Shop"
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

      {/* Shop List */}
      <Stack
        direction="row"
        flexWrap="wrap"
        justifyContent="center"
        alignItems="stretch"
        gap={2}
      >
        {filteredShops.length > 0 ? (
          filteredShops.map((shop, index) => (
            <ProductCard
              key={index}
              item={shop}
              onError={(e) => {
                if (!e.target.dataset.error) {
                  console.error(`Failed to load image for shop ${shop.id}`);
                  e.target.dataset.error = "true"; // Mark as failed
                  e.target.src = "/placeholder.png"; // Use local fallback
                }
              }}
            />
          ))
        ) : (
          <Typography variant="body1" color="warning">
            No matching shops found.
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default ShopList;
