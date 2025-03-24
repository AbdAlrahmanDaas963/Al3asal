import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://asool-gifts.com/api";
const getToken = () => localStorage.getItem("token"); // Retrieve token dynamically

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Fetch Orders with Filters
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(
        Object.entries(filters).filter(([_, value]) => value !== "") // Remove empty values
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

      return response.data?.data || []; // Ensure it always returns an array
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching orders"
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
  },
  reducers: {},
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
      });
  },
});

export default ordersSlice.reducer;
