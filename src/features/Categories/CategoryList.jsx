import React, { useState, useEffect } from "react";
import { Stack, Typography, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CategoryCard from "../../components/common/CategoryCard";

const CategoryList = ({ categories, status, error }) => {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    console.log("Categories received:", categories);
  }, [categories]);

  if (status === "loading") {
    return <Typography variant="body1">Loading categories...</Typography>;
  }

  if (status === "failed") {
    return (
      <Typography variant="body1" color="error">
        Error: {typeof error === "string" ? error : JSON.stringify(error)}
      </Typography>
    );
  }

  if (!Array.isArray(categories) || categories.length === 0) {
    return <Typography variant="body1">No categories available.</Typography>;
  }

  const filteredCategories = categories.filter((category) => {
    const categoryName =
      typeof category.name === "string"
        ? category.name
        : category.name?.en || category.name?.ar || "";
    return categoryName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <Stack
      spacing={3}
      sx={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search for Category"
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

      <Stack
        direction="row"
        flexWrap="wrap"
        justifyContent="center"
        alignItems="stretch"
        gap={2}
      >
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category, index) => (
            <CategoryCard key={index} category={category} />
          ))
        ) : (
          <Typography variant="body1" color="warning">
            No matching categories found.
          </Typography>
        )}
      </Stack>
    </Stack>
  );
};

export default CategoryList;
