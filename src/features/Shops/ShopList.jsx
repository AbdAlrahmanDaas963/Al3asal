import React, { useState } from "react";
import { Stack, Typography, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ProductCard from "../../components/common/ProdcutCard";

const ShopList = ({ shops, status, error }) => {
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredShops = shops.data.filter((shop) =>
    shop.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Stack
      spacing={3}
      sx={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search for Shop"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{
          backgroundColor: "#222",
          borderRadius: "25px",
          input: { color: "white", padding: "10px" },
          "& .MuiOutlinedInput-root": {
            borderRadius: "25px",
            "& fieldset": { border: "none" },
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

      <Stack
        direction="row"
        flexWrap="wrap"
        justifyContent="center"
        alignItems="stretch"
        gap={2}
      >
        {filteredShops.length > 0 ? (
          filteredShops.map((shop) => <ProductCard key={shop.id} item={shop} />)
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
