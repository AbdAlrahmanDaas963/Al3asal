import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://asool-gifts.com/api/products";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const response = await axios.get(API_BASE_URL, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          Accept: "application/json",
        },
      });
      return response.data; // Successful response
    } catch (error) {
      // Handle errors, but don't break the UI
      const errorMessage =
        error.response?.data || error.message || "Failed to fetch products";
      return rejectWithValue(errorMessage); // Pass the error message to the UI
    }
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (productData, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const formData = new FormData();
      Object.keys(productData).forEach((key) => {
        formData.append(key, productData[key]);
      });
      const response = await axios.post(`${API_BASE_URL}/create`, formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to create product"
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (id, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          Accept: "application/json",
        },
      });
      console.log("Product data fetched:", response.data); // Remove this in production
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch product");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const formData = new FormData();
      Object.keys(productData).forEach((key) => {
        formData.append(key, productData[key]);
      });
      const response = await axios.post(
        `${API_BASE_URL}/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update product"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const response = await axios.get(`${API_BASE_URL}/destroy/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          Accept: "application/json",
        },
      });
      return { id };
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete product"
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    status: "idle",
    error: null,
    products: { data: [], status: null, error: null },
    selectedProduct: null,
  },
  reducers: {
    resetStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products.data = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products.data.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.products.data.findIndex(
          (p) => p.id === action.payload.id
        );
        if (index !== -1) {
          state.products.data[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products.data = state.products.data.filter(
          (p) => p.id !== action.payload.id
        );
      });
  },
});

export const { resetStatus } = productSlice.actions;
export default productSlice.reducer;
