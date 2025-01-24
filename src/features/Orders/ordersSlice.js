// features/Orders/ordersSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = "https://asool-gifts.com/api"; // Update the base URL

// Async thunk for filtering orders
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const response = await axios.get("https://asool-gifts.com/api/orders", {
        headers: { Authorization: `Bearer ${auth.token}` }, // Add token if required
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching orders:",
        error.response?.data || error.message
      );
      return rejectWithValue(error.response?.data || "Failed to fetch orders");
    }
  }
);

// Async thunk for updating order status
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status, reason }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const url = reason
      ? `${BASE_URL}/orders/${orderId}/status/${status}`
      : `${BASE_URL}/orders/${orderId}/status/${status}`;
    const config = {
      headers: { Authorization: `Bearer ${auth.token}` },
    };

    try {
      const response = reason
        ? await axios.post(url, { reject_reason: reason }, config)
        : await axios.post(url, {}, config);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update order status"
      );
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateOrderStatus.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default ordersSlice.reducer;
