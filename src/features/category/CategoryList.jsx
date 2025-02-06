import React, { useState } from "react";
import { Stack, Typography, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ProductCard from "../../components/common/ProdcutCard";

const CategoryList = ({ category, status, error }) => {
  const [searchQuery, setSearchQuery] = useState("");

  if (status === "loading") {
    return <Typography variant="body1">Loading category...</Typography>;
  }

  if (status === "failed") {
    return (
      <Typography variant="body1" color="error">
        Error: {typeof error === "string" ? error : JSON.stringify(error)}
      </Typography>
    );
  }

  if (!Array.isArray(category?.data) || category.data.length === 0) {
    return <Typography variant="body1">No category available.</Typography>;
  }

  const filteredCategory = category.data.filter((shop) =>
    shop?.name?.toLowerCase()?.includes(searchQuery.toLowerCase())
  );

  console.log("Rendering category:", filteredCategory);

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
        {filteredCategory.length > 0 ? (
          filteredCategory.map((shop) => (
            <ProductCard key={shop.id} item={shop} />
          ))
        ) : (
          <Typography variant="body1" color="warning">
            No matching Category found.
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default CategoryList;
