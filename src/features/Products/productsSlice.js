import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_URL = `${BASE_URL}/dashboard/product`;
const API_URL2 = `${BASE_URL}/products`;

// Helper functions
const getToken = () => {
  try {
    return localStorage.getItem("token") || null;
  } catch (error) {
    console.error("LocalStorage access error:", error);
    return null;
  }
};

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
    if (error.response?.status === 401) {
      return rejectWithValue("Session expired - please login again");
    }
    return rejectWithValue(
      error.response?.data?.message || error.message || "Request failed"
    );
  }
};

// Thunks
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { getState, rejectWithValue }) => {
    const { products } = getState();
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

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, { rejectWithValue }) => {
    try {
      // Debug: Log incoming formData
      console.log("Received formData in createProduct:");
      if (formData instanceof FormData) {
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }
      } else {
        console.log("Regular Object:", formData);
      }

      const response = await axios.post(`${API_URL2}/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${getToken()}`,
        },
      });

      return response.data;
    } catch (error) {
      console.error("API Error:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Product creation failed"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ productId, updatedData }, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Append all fields consistently with Postman example
      formData.append("name[en]", updatedData.get("name[en]") || "");
      formData.append("name[ar]", updatedData.get("name[ar]") || "");

      // Handle image if it exists in the FormData
      const imageFile = updatedData.get("image");
      if (imageFile instanceof File) {
        formData.append("image", imageFile);
      }

      // Append other required fields
      formData.append("is_hot", updatedData.get("is_hot") || "0");
      formData.append("category_id", updatedData.get("category_id") || "");
      formData.append(
        "profit_percentage",
        updatedData.get("profit_percentage") || ""
      );
      formData.append("price", updatedData.get("price") || "");

      // Append descriptions if they exist
      if (updatedData.get("description[en]")) {
        formData.append("description[en]", updatedData.get("description[en]"));
      }
      if (updatedData.get("description[ar]")) {
        formData.append("description[ar]", updatedData.get("description[ar]"));
      }

      // Debug: Log the FormData before sending
      console.log("FormData contents for update:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await axios.post(
        `${API_URL2}/update/${productId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "Update product error:",
        error.response?.data || error.message
      );
      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.errors ||
          "Failed to update product"
      );
    }
  }
);

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

// Initial state
const initialState = {
  data: [],
  selectedProduct: null,
  status: "idle",
  error: null,
  lastFetched: null,
};

// Slice
const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
    resetProductsState: () => initialState,
    clearProductsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
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
  },
});

// Named exports for all action creators and thunks
// export const { clearSelectedProduct, resetProductsState, clearProductsError } =
//   productsSlice.actions;

// export {
//   fetchProducts,
//   fetchProductById,
//   createProduct,
//   updateProduct,
//   deleteProduct,
// };

export default productsSlice.reducer;
