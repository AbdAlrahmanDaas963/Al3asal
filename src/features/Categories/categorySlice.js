import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const API_URL = `${BASE_URL}/categories`;

// Update Category
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, categoryData }, { getState, rejectWithValue }) => {
    const { auth } = getState(); // Get authentication token from state

    try {
      const formData = new FormData();

      // Debugging: Log categoryData before appending
      console.log("categoryData received:", categoryData);

      // Ensure name exists and is an object
      if (categoryData.name && typeof categoryData.name === "object") {
        if (categoryData.name.en)
          formData.append("name[en]", categoryData.name.en);
        if (categoryData.name.ar)
          formData.append("name[ar]", categoryData.name.ar);
      } else {
        console.error(
          "categoryData.name is missing or incorrect:",
          categoryData.name
        );
      }

      // Append image only if it's a File object
      if (categoryData.image instanceof File) {
        formData.append("image", categoryData.image);
      }

      // Debugging: Log FormData values
      console.log("FormData being sent:", Object.fromEntries(formData));

      const response = await axios.post(`${API_URL}/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`, // Attach the token
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });

      return response.data;
    } catch (error) {
      console.error("Error response:", error.response?.data);
      return rejectWithValue(
        error.response?.data || { message: "Failed to update category" }
      );
    }
  }
);

// Fetch Categories
export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      return data.data; // Extracting only categories array
    } catch (error) {
      return rejectWithValue(error.message);
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
          Authorization: `Bearer ${auth.token}`,
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
          Authorization: `Bearer ${auth.token}`,
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
    categories: [],
    selectedCategory: null, // Adding a field for selected category
    status: "idle",
    error: null,
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
        state.categories = action.payload;
        state.data = action.payload;
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
