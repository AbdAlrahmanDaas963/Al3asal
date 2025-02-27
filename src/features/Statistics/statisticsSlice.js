import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://asool-gifts.com/api/analytics";

// Helper function to fetch data with token
const fetchData = async (endpoint, token, params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` },
      params, // Attach query parameters
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || "Error fetching data";
  }
};

// Async thunks with dynamic range support
export const fetchTopShops = createAsyncThunk(
  "statistics/fetchTopShops",
  async ({ range = "weekly" }) => {
    const response = await axios.get(
      `${API_BASE_URL}/top-shops?range=${range}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  }
);

export const fetchTopCategories = createAsyncThunk(
  "statistics/fetchTopCategories",
  async ({ range = "weekly" }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await fetchData("top-categories", token, { range });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchTopProducts = createAsyncThunk(
  "statistics/fetchTopProducts",
  async () => {
    console.log("Fetching top products..."); // ✅ Debug log
    const response = await axios.get(
      `${API_BASE_URL}/top-products?range=weekly`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("Response:", response.data); // ✅ See what API returns
    return response.data;
  }
);

export const fetchEarnings = createAsyncThunk(
  "statistics/fetchEarnings",
  async ({ range = "weekly" }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      return await fetchData("earnings", token, { range });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// Slice
const statisticsSlice = createSlice({
  name: "statistics",
  initialState: {
    topShops: [],
    topCategories: [],
    topProducts: [],
    earnings: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopShops.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTopShops.fulfilled, (state, action) => {
        state.loading = false;
        state.topShops = action.payload;
      })
      .addCase(fetchTopShops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTopCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTopCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.topCategories = action.payload;
      })
      .addCase(fetchTopCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchTopProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.topProducts = action.payload;
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchEarnings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEarnings.fulfilled, (state, action) => {
        state.loading = false;
        state.earnings = action.payload;
      })
      .addCase(fetchEarnings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default statisticsSlice.reducer;
