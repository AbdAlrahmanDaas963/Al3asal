import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const API_URL = `${BASE_URL}/categories`;

const logFormData = (formData) => {
  console.log("--- FormData Contents ---");
  if (formData instanceof FormData) {
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }
  } else {
    console.log("Regular Object:", formData);
  }
  console.log("-------------------------");
};

const getToken = () => {
  try {
    return localStorage.getItem("token") || null;
  } catch (error) {
    console.error("LocalStorage access error:", error);
    return null;
  }
};

// Update Category
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, formData }, { getState, rejectWithValue }) => {
    // Changed parameter name
    const { auth } = getState();

    try {
      // Debug: Verify received FormData
      console.log("Received FormData in slice:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await axios.post(`${API_URL}/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      console.error("API Error:", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Fetch Categories
export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState(); // Get auth state
    try {
      const { categories } = getState();

      // Return cached data if recent (5 minute cache)
      if (
        categories.lastFetched &&
        Date.now() - categories.lastFetched < 300000
      ) {
        return categories.data || categories.categories;
      }

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${auth.token}`, // Add authorization
          Accept: "application/json",
        },
      });

      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch Category by ID
export const fetchCategoryById = createAsyncThunk(
  "categories/fetchCategoryById",
  async (id, { getState, rejectWithValue }) => {
    const { auth } = getState(); // Get authentication token from state
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`, // Attach the token to the request
          Accept: "application/json",
        },
      });

      console.log("Category data fetched:", response.data);
      return response.data; // Return the fetched category data
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch category"
      );
    }
  }
);

// Create Category
export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (categoryData, { getState, rejectWithValue }) => {
    const { auth } = getState(); // Get authentication token from state

    try {
      const formData = new FormData();

      if (categoryData.name && typeof categoryData.name === "object") {
        formData.append("name[en]", categoryData.name.en);
        formData.append("name[ar]", categoryData.name.ar);
      }

      if (categoryData.is_interested) {
        formData.append("is_interested", categoryData.is_interested);
      }
      if (categoryData.shop_id) {
        const shopIdsArray = Array.isArray(categoryData.shop_id)
          ? categoryData.shop_id
          : [categoryData.shop_id]; // Ensure it's always an array

        shopIdsArray.forEach((id) => {
          formData.append("shop_ids[]", id); // Append each shop ID properly
        });
      }

      if (categoryData.image instanceof File) {
        formData.append("image", categoryData.image);
      }

      const response = await axios.post(`${API_URL}/create`, formData, {
        headers: {
          Authorization: `Bearer ${auth.token || getToken()}`, // Fallback to localStorage
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create category"
      );
    }
  }
);

// Delete Category
export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      await axios.delete(`${API_URL}/destroy/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token || getToken()}`, // Fallback to localStorage
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete category"
      );
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    data: [], // Primary data field
    categories: [], // Legacy field (for backward compatibility)
    selectedCategory: null,
    status: "idle",
    error: null,
    lastFetched: null, // Track when data was last fetched
  },
  reducers: {
    resetStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
        state.categories = action.payload; // Maintain both fields
        state.lastFetched = Date.now();
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchCategoryById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedCategory = action.payload; // Store the fetched category data
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.categories.findIndex(
          (cat) => cat.id === action.payload.id
        );
        if (index !== -1) state.categories[index] = action.payload;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = state.categories.filter(
          (cat) => cat.id !== action.payload
        );
      });
  },
});

export const { resetStatus } = categorySlice.actions;
export default categorySlice.reducer;

// export { fetchCategoryById };
