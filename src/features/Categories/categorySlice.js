import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_URL = `${BASE_URL}/categories`;

// Helper Functions
const getToken = () => {
  try {
    return localStorage.getItem("token") || null;
  } catch (error) {
    console.error("LocalStorage access error:", error);
    return null;
  }
};

const handleApiError = (error) => {
  console.error("API Error:", error);
  return {
    message: error.response?.data?.message || error.message,
    status: error.response?.status,
    data: error.response?.data,
  };
};

// Thunks
export const fetchCategories = createAsyncThunk(
  "categories/fetchAll",
  async (_, { getState, rejectWithValue }) => {
    const { auth, categories } = getState();

    try {
      // Cache validation (5 minutes)
      if (
        categories.lastFetched &&
        Date.now() - categories.lastFetched < 300000
      ) {
        return categories.data;
      }

      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          Accept: "application/json",
        },
      });

      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchCategoryById = createAsyncThunk(
  "categories/fetchCategoryById",
  async (id, { getState, rejectWithValue }) => {
    const { auth } = getState();

    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          Accept: "application/json",
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const createCategory = createAsyncThunk(
  "categories/createCategory",
  async (categoryData, { getState, rejectWithValue, dispatch }) => {
    const { auth } = getState();

    try {
      const formData = new FormData();

      // Handle multilingual names
      if (categoryData.name && typeof categoryData.name === "object") {
        formData.append("name[en]", categoryData.name.en);
        formData.append("name[ar]", categoryData.name.ar);
      }

      // Append other fields
      if (categoryData.is_interested) {
        formData.append("is_interested", categoryData.is_interested);
      }

      if (categoryData.shop_id) {
        const shopIdsArray = Array.isArray(categoryData.shop_id)
          ? categoryData.shop_id
          : [categoryData.shop_id];
        shopIdsArray.forEach((id) => formData.append("shop_ids[]", id));
      }

      if (categoryData.image instanceof File) {
        formData.append("image", categoryData.image);
      }

      const response = await axios.post(`${API_URL}/create`, formData, {
        headers: {
          Authorization: `Bearer ${auth.token || getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // Force refresh categories after creation
      dispatch(fetchCategories());

      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, formData }, { getState, rejectWithValue }) => {
    const { auth } = getState();

    try {
      const response = await axios.post(`${API_URL}/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "categories/deleteCategory",
  async (id, { getState, rejectWithValue }) => {
    const { auth } = getState();

    try {
      await axios.delete(`${API_URL}/destroy/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token || getToken()}`,
        },
      });
      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Slice
const categorySlice = createSlice({
  name: "categories",
  initialState: {
    data: [],
    selectedCategory: null,
    status: "idle",
    error: null,
    lastFetched: null,
    operation: null,
  },
  reducers: {
    resetStatus: (state) => {
      state.status = "idle";
      state.error = null;
      state.operation = null;
    },
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
    resetCategories: (state) => {
      state.data = [];
      state.selectedCategory = null;
      state.status = "idle";
      state.error = null;
      state.lastFetched = null;
      state.operation = null;
    },
    // Add a new reducer to handle optimistic updates
    addTempCategory: (state, action) => {
      state.data.unshift({
        ...action.payload,
        id: `temp-${Date.now()}`,
        isTemp: true,
      });
    },
    removeTempCategory: (state, action) => {
      state.data = state.data.filter((cat) => cat.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = "loading";
        state.operation = "fetchAll";
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Filter out any temporary categories before adding new data
        state.data = action.payload.filter((cat) => !cat.isTemp);
        state.lastFetched = Date.now();
        state.operation = null;
      })
      .addCase(fetchCategoryById.pending, (state) => {
        state.status = "loading";
        state.operation = "fetchById";
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedCategory = action.payload;
        state.operation = null;
      })
      .addCase(createCategory.pending, (state, action) => {
        state.status = "loading";
        state.operation = "create";
        // Add temporary category with minimal data
        state.data.unshift({
          id: `temp-${Date.now()}`,
          isTemp: true,
          name: action.meta.arg.name || { en: "New Category", ar: "فئة جديدة" },
          image: action.meta.arg.image || null,
          is_interested: action.meta.arg.is_interested || false,
        });
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        // Replace temporary category with server response
        const tempIndex = state.data.findIndex((cat) => cat.isTemp);
        if (tempIndex !== -1) {
          state.data[tempIndex] = action.payload;
        } else {
          state.data.unshift(action.payload);
        }
        state.operation = null;
      })
      .addCase(updateCategory.pending, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        // Remove temporary category if creation failed
        state.data = state.data.filter((cat) => !cat.isTemp);
        state.operation = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.data.findIndex(
          (cat) => cat.id === action.payload.id
        );
        if (index !== -1) state.data[index] = action.payload;
        if (state.selectedCategory?.id === action.payload.id) {
          state.selectedCategory = action.payload;
        }
        state.operation = null;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.status = "loading";
        state.operation = "delete";
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter((cat) => cat.id !== action.payload);
        if (state.selectedCategory?.id === action.payload) {
          state.selectedCategory = null;
        }
        state.operation = null;
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("categories/") &&
          action.type.endsWith("/rejected"),
        (state, action) => {
          state.status = "failed";
          state.error = action.payload;
          state.operation = null;

          // Remove temporary category if creation failed
          if (
            action.type === "categories/createCategory/rejected" &&
            action.meta.arg.tempId
          ) {
            state.data = state.data.filter(
              (cat) => cat.id !== action.meta.arg.tempId
            );
          }
        }
      );
  },
});

export const {
  resetStatus,
  clearSelectedCategory,
  resetCategories,
  addTempCategory,
  removeTempCategory,
} = categorySlice.actions;

export default categorySlice.reducer;
