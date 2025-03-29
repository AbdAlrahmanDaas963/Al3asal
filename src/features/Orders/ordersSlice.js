import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const getToken = () => localStorage.getItem("token");
const BASE_URL = "https://api.asool-gifts.com/api";

// Status normalization mapping
const normalizeStatus = (status) => {
  const statusMap = {
    prepering: "preparing",
    rejected: "rejected",
    done: "done",
    stripe_pending: "pending",
  };
  return statusMap[status] || status;
};

// Fetch orders (unchanged from your working version)
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(
        Object.entries(filters).filter(([_, value]) => value !== "")
      ).toString();

      const response = await axios.get(
        `${BASE_URL}/orders/filter?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            Accept: "application/json",
          },
        }
      );

      // Normalize statuses in response
      const normalizedOrders =
        response.data?.data?.map((order) => ({
          ...order,
          status: normalizeStatus(order.status),
        })) || [];

      return normalizedOrders;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching orders"
      );
    }
  }
);

// Update order status - MATCHING YOUR POSTMAN ENDPOINTS EXACTLY
export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ orderId, status, rejectReason = null }, { rejectWithValue }) => {
    try {
      let url, body, contentType;

      // Match exactly what your Postman collection shows
      switch (status) {
        case "preparing":
          url = `${BASE_URL}/orders/${orderId}/status/preparing`;
          body = null;
          contentType = "application/json";
          break;

        case "done":
          url = `${BASE_URL}/orders/${orderId}/status/done`;
          body = null;
          contentType = "application/json";
          break;

        case "rejected":
          url = `${BASE_URL}/orders/${orderId}/status/rejected`;
          body = new FormData();
          body.append("reject_reason", rejectReason);
          contentType = "multipart/form-data";
          break;

        default:
          throw new Error(`Invalid status: ${status}`);
      }

      const response = await axios.post(url, body, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
          "Content-Type": contentType,
        },
      });

      return {
        ...response.data,
        status: normalizeStatus(response.data.status),
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Status update failed"
      );
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
    statusUpdating: false,
    statusError: null,
  },
  reducers: {
    resetStatusUpdate: (state) => {
      state.statusUpdating = false;
      state.statusError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderStatus.pending, (state) => {
        state.statusUpdating = true;
        state.statusError = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.statusUpdating = false;
        const updatedOrder = action.payload;
        state.orders = state.orders.map((order) =>
          order.id === updatedOrder.id ? updatedOrder : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.statusUpdating = false;
        state.statusError = action.payload;
      });
  },
});

export const { resetStatusUpdate } = ordersSlice.actions;
export default ordersSlice.reducer;
