import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Constants
const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_BASE_URL = `${BASE_URL}/orders`;
const getToken = () => localStorage.getItem("token");

// Helper function to normalize status values
const normalizeStatus = (status) => {
  const statusMap = {
    prepering: "preparing",
    fail: "rejected",
    stripe_pending: "pending",
    preparing: "preparing",
    done: "done",
    pending: "pending",
  };
  return statusMap[status] || status;
};

// Helper function to create headers
const getHeaders = (contentType = "application/json") => ({
  Authorization: `Bearer ${getToken()}`,
  Accept: "application/json",
  ...(contentType && { "Content-Type": contentType }),
});

// Fetch orders with filters
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (filters = {}, { rejectWithValue }) => {
    try {
      // Clean filters - remove empty values
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => value !== "" && value !== null
        )
      );

      const response = await axios.get(`${API_BASE_URL}/filter`, {
        params: cleanFilters,
        headers: getHeaders(),
      });

      // Normalize statuses in response
      return (response.data?.data || []).map((order) => ({
        ...order,
        status: normalizeStatus(order.status),
      }));
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching orders"
      );
    }
  }
);

// Update the updateOrderStatus thunk
export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async (
    { orderId, newStatus, currentStatus, rejectReason = null },
    { getState, rejectWithValue }
  ) => {
    try {
      // Frontend and backend now use same status names in URLs
      const urlStatusMap = {
        preparing: "preparing",
        rejected: "rejected", // Now using 'rejected' in URL
        pending: "preparing",
        done: "done",
      };

      const urlStatus = urlStatusMap[newStatus] || newStatus;
      console.log("Current Status:", currentStatus);
      console.log("New Status:", newStatus);
      console.log("URL Status:", urlStatus);

      // Validate status transitions
      const validTransitions = {
        pending: ["preparing", "rejected"],
        preparing: ["done"],
        rejected: [],
      };

      if (!validTransitions[currentStatus]?.includes(newStatus)) {
        return rejectWithValue(
          `Invalid status transition from ${currentStatus} to ${newStatus}`
        );
      }

      // Handle rejection specifically
      if (newStatus === "rejected") {
        if (!rejectReason || rejectReason.trim() === "") {
          return rejectWithValue("Rejection reason is required");
        }

        const url = `${API_BASE_URL}/${orderId}/status/rejected`; // Now using 'rejected'
        const formData = new FormData();
        formData.append("reject_reason", rejectReason);

        const response = await axios.post(url, formData, {
          headers: getHeaders("multipart/form-data"),
        });
        console.log("API Response:", response.data);

        return {
          ...response.data,
          status: "rejected", // Keep as 'rejected' in frontend
        };
      }

      // Handle other status changes
      const url = `${API_BASE_URL}/${orderId}/status/${urlStatus}`;
      const response = await axios.post(url, {}, { headers: getHeaders() });

      return {
        ...response.data,
        status: newStatus === "pending" ? "preparing" : newStatus,
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Status update failed"
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
    filters: {
      min_price: "",
      max_price: "",
      date_from: "",
      date_to: "",
      status: "",
      reciver_name: "",
      per_page: "",
      category_id: "",
    },
  },
  reducers: {
    resetStatusUpdate: (state) => {
      state.statusUpdating = false;
      state.statusError = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = ordersSlice.getInitialState().filters;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders cases
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

      // Update status cases
      .addCase(updateOrderStatus.pending, (state) => {
        state.statusUpdating = true;
        state.statusError = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.statusUpdating = false;

        // Optimistically update the specific order
        const updatedOrder = action.payload;
        state.orders = state.orders.map((order) =>
          order.id === updatedOrder.id ? { ...order, ...updatedOrder } : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.statusUpdating = false;
        state.statusError = action.payload;
      });
  },
});

export const { resetStatusUpdate, setFilters, resetFilters } =
  ordersSlice.actions;
export default ordersSlice.reducer;
