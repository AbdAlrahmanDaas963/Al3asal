import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const API_BASE_URL = `${BASE_URL}/shops`;
const getToken = () => localStorage.getItem("token"); // Retrieve token dynamically

// Fetch all shops
export const fetchShops = createAsyncThunk(
  "shops/fetchShops",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch shops");
    }
  }
);

// Create a shop
export const createShop = createAsyncThunk(
  "shops/createShop",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/create`, formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create shop");
    }
  }
);

// Update a shop
export const updateShop = createAsyncThunk(
  "shops/updateShop",
  async ({ shop_id, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/update/${shop_id}`, // ✅ Updated to shop_id
        formData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update shop");
    }
  }
);

// Delete a shop
export const deleteShop = createAsyncThunk(
  "shops/deleteShop",
  async (shopId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/destroy/${shopId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return shopId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete shop");
    }
  }
);

// Fetch shop by ID
export const fetchShopById = createAsyncThunk(
  "shops/fetchShopById",
  async (shopId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${shopId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch shop");
    }
  }
);

// Initial state
const initialState = {
  shops: {
    data: [],
    status: true,
    error: null,
    statusCode: 200,
  },
  status: "idle",
  error: null,
  selectedShop: null,
};

// Create shop slice
const shopSlice = createSlice({
  name: "shops",
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
    setSelectedShop: (state, action) => {
      state.selectedShop = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all shops
      .addCase(fetchShops.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchShops.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.shops.data = action.payload.data; // Updated to match API response
        state.data = action.payload;
      })
      .addCase(fetchShops.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Create a shop
      .addCase(createShop.fulfilled, (state, action) => {
        state.shops.data.push(action.payload);
        state.status = "idle"; // Reset status
      })

      // Update a shop
      .addCase(updateShop.fulfilled, (state, action) => {
        const index = state.shops.data.findIndex(
          (shop) => shop.id === action.payload.id
        );
        if (index !== -1) {
          state.shops.data[index] = action.payload;
        }
        state.status = "idle"; // Reset status
      })

      // Delete a shop
      .addCase(deleteShop.fulfilled, (state, action) => {
        state.shops.data = state.shops.data.filter(
          (shop) => shop.id !== action.payload
        );
        state.status = "idle"; // Reset status
      })

      // Fetch shop by ID
      .addCase(fetchShopById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchShopById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedShop = action.payload;
      })
      .addCase(fetchShopById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetStatus, setSelectedShop } = shopSlice.actions;
export default shopSlice.reducer;
