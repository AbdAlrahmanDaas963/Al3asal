import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://asool-gifts.com/api/categories";

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

      const response = await axios.post(
        `https://asool-gifts.com/api/categories/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`, // Attach the token
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );

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
      const response = await fetch("https://asool-gifts.com/api/categories");

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
      const response = await axios.get(
        `https://asool-gifts.com/api/categories/${id}`,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`, // Attach the token to the request
            Accept: "application/json",
          },
        }
      );

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

      // Assuming categoryData has 'name' (with 'en' and 'ar' keys) and an image
      if (categoryData.name && typeof categoryData.name === "object") {
        // Append names in English and Arabic
        formData.append("name[en]", categoryData.name.en);
        formData.append("name[ar]", categoryData.name.ar);
      }

      // Append 'is_interested' and 'shop_id' if provided
      if (categoryData.is_interested) {
        formData.append("is_interested", categoryData.is_interested);
      }
      if (categoryData.shop_id) {
        formData.append("shop_id", categoryData.shop_id);
      }

      // Append the image if provided
      if (categoryData.image instanceof File) {
        formData.append("image", categoryData.image);
      }

      // Making the request to create the category
      const response = await axios.post(
        "https://asool-gifts.com/api/categories/create", // Modify with your API URL
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`, // Attach the token
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );

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
