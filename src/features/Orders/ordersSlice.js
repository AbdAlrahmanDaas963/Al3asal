import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api/orders";

// Fetch Orders with filters
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (filters, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const response = await axios.get(API_BASE_URL, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          Accept: "application/json",
        },
        params: filters,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch orders");
    }
  }
);

// Update Order Status
export const updateOrderStatus = createAsyncThunk(
  "orders/updateOrderStatus",
  async ({ orderId, status }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const response = await axios.post(
        `${API_BASE_URL}/${orderId}/status/${status}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            Accept: "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to update order status"
      );
    }
  }
);

// Reject Order
export const rejectOrder = createAsyncThunk(
  "orders/rejectOrder",
  async ({ orderId, rejectReason }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const formData = new FormData();
      formData.append("reject_reason", rejectReason);
      const response = await axios.post(
        `${API_BASE_URL}/${orderId}/status/rejected`,
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
      return rejectWithValue(error.response?.data || "Failed to reject order");
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    status: "idle",
    error: null,
    orders: { data: [], status: null, error: null, statusCode: null },
  },
  reducers: {
    resetStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
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
      })
      .addCase(rejectOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(rejectOrder.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(rejectOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetStatus } = ordersSlice.actions;
export default ordersSlice.reducer;
