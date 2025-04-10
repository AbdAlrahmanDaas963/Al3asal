import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_URL = `${BASE_URL}/dashboard/product`;
const API_URL2 = `${BASE_URL}/products`;

// Enhanced token getter with error handling
const getToken = () => {
  try {
    return localStorage.getItem("token") || null;
  } catch (error) {
    console.error("LocalStorage access error:", error);
    return null;
  }
};

// Helper function for API calls with auth
const authApiCall = async (config, { rejectWithValue }) => {
  try {
    const token = getToken();
    if (!token) {
      return rejectWithValue("Authentication token missing");
    }

    const response = await axios({
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    // Handle 401 Unauthorized specifically
    if (error.response?.status === 401) {
      return rejectWithValue("Session expired - please login again");
    }
    return rejectWithValue(
      error.response?.data?.message || error.message || "Request failed"
    );
  }
};

// Fetch all products with enhanced error handling
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { getState, rejectWithValue }) => {
    const { products } = getState();

    // Return cached data if recent (5 minute cache)
    if (products.lastFetched && Date.now() - products.lastFetched < 300000) {
      return products.data;
    }

    return authApiCall(
      {
        method: "get",
        url: API_URL,
        headers: { "Content-Type": "application/json" },
      },
      { rejectWithValue }
    );
  }
);

// Fetch product by ID
export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId, { rejectWithValue }) => {
    return authApiCall(
      {
        method: "get",
        url: `${API_URL2}/${productId}`,
        headers: { "Content-Type": "application/json" },
      },
      { rejectWithValue }
    );
  }
);

// Create product
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { rejectWithValue }) => {
    return authApiCall(
      {
        method: "post",
        url: `${API_URL2}/create`,
        data: productData,
        headers: { "Content-Type": "multipart/form-data" },
      },
      { rejectWithValue }
    );
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ productId, updatedData }, { rejectWithValue }) => {
    return authApiCall(
      {
        method: "post",
        url: `${API_URL2}/update/${productId}`,
        data: updatedData,
        headers: { "Content-Type": "multipart/form-data" },
      },
      { rejectWithValue }
    );
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { rejectWithValue }) => {
    return authApiCall(
      {
        method: "delete",
        url: `${API_URL2}/destroy/${productId}`,
      },
      { rejectWithValue }
    ).then(() => productId); // Return productId on success
  }
);

const initialState = {
  data: [],
  selectedProduct: null,
  status: "idle",
  error: null,
  lastFetched: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    resetProductsState: () => initialState,
    // Add this to handle auth errors globally
    clearProductsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // First handle all specific cases
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.data = action.payload.data || [];
        state.status = "succeeded";
        state.lastFetched = Date.now();
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(fetchProductById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.selectedProduct = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(createProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.data.unshift(action.payload);
        state.status = "succeeded";
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(updateProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.data.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.data[index] = action.payload;
        state.status = "succeeded";
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(deleteProduct.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.data = state.data.filter((p) => p.id !== action.payload);
        state.status = "succeeded";
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    // Then add auto-clear error functionality for all rejected actions
    builder.addMatcher(
      (action) => action.type.endsWith("/rejected"),
      (state) => {
        setTimeout(() => {
          state.error = null;
        }, 5000);
      }
    );
  },
});

export const { clearSelectedProduct, resetProductsState, clearProductsError } =
  productsSlice.actions;
export default productsSlice.reducer;
