import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_BASE_URL2 = `${BASE_URL}/analytics`;

// Helper function to get token from localStorage
const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const initialState = {
  earnings: {
    data: [],
    status: false,
    error: null,
    statusCode: null,
  },
  topShops: {
    data: [],
    status: false,
    error: null,
    statusCode: null,
  },
  topProducts: {
    data: [],
    status: false,
    error: null,
    statusCode: null,
  },
  topCategories: {
    data: [],
    status: false,
    error: null,
    statusCode: null,
  },
  topSales: {
    data: null,
    usersCount: 0,
    status: false,
    error: null,
    statusCode: null,
  },
  loading: false,
  error: null,
};

// Async Thunks with token authentication
export const fetchEarnings = createAsyncThunk(
  "statistics/fetchEarnings",
  async (range, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL2}/earnings`, {
        ...getAuthConfig(),
        params: { range },
      });
      console.group("fetchEarnings - Full Response");
      console.log("Status:", response.status);
      console.log("Headers:", response.headers);
      console.log("Data:", response.data);
      console.groupEnd();
      return response.data;
    } catch (error) {
      console.error("fetchEarnings - Error:", error.response || error.message);
      if (error.response?.status === 401) {
        return rejectWithValue("Unauthorized - Please login again");
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTopShops = createAsyncThunk(
  "statistics/fetchTopShops",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL2}/top-shops`,
        getAuthConfig()
      );
      console.group("fetchTopShops - Full Response");
      console.log("Status:", response.status);
      console.log("Headers:", response.headers);
      console.log("Data:", response.data);
      console.groupEnd();
      return response.data;
    } catch (error) {
      console.error("fetchTopShops - Error:", error.response || error.message);
      if (error.response?.status === 401) {
        return rejectWithValue("Unauthorized - Please login again");
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTopProducts = createAsyncThunk(
  "statistics/fetchTopProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL2}/top-products`,
        getAuthConfig()
      );
      console.group("fetchTopProducts - Full Response");
      console.log("Status:", response.status);
      console.log("Headers:", response.headers);
      console.log("Data:", response.data);
      console.groupEnd();
      return response.data;
    } catch (error) {
      console.error(
        "fetchTopProducts - Error:",
        error.response || error.message
      );
      if (error.response?.status === 401) {
        return rejectWithValue("Unauthorized - Please login again");
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTopCategories = createAsyncThunk(
  "statistics/fetchTopCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL2}/top-categories`,
        getAuthConfig()
      );
      console.group("fetchTopCategories - Full Response");
      console.log("Status:", response.status);
      console.log("Headers:", response.headers);
      console.log("Data:", response.data);
      console.groupEnd();
      return response.data;
    } catch (error) {
      console.error(
        "fetchTopCategories - Error:",
        error.response || error.message
      );
      if (error.response?.status === 401) {
        return rejectWithValue("Unauthorized - Please login again");
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTopSales = createAsyncThunk(
  "statistics/fetchTopSales",
  async (range, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL2}/top-sales`, {
        ...getAuthConfig(),
        params: { range },
      });
      console.group("fetchTopSales - Full Response");
      console.log("Status:", response.status);
      console.log("Headers:", response.headers);
      console.log("Data:", response.data);
      console.groupEnd();
      return response.data;
    } catch (error) {
      console.error("fetchTopSales - Error:", error.response || error.message);
      if (error.response?.status === 401) {
        return rejectWithValue("Unauthorized - Please login again");
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const statisticsSlice = createSlice({
  name: "statistics",
  initialState,
  reducers: {
    resetStatistics: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Earnings
      .addCase(fetchEarnings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEarnings.fulfilled, (state, action) => {
        state.loading = false;
        state.earnings = action.payload;
      })
      .addCase(fetchEarnings.rejected, (state, action) => {
        state.loading = false;
        state.earnings.error = action.payload;
        if (action.payload === "Unauthorized - Please login again") {
          state.error = action.payload;
        }
      })
      // Top Shops
      .addCase(fetchTopShops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopShops.fulfilled, (state, action) => {
        console.log("Fetched Top Shops Data:", action.payload);
        state.loading = false;
        state.topShops = action.payload;
      })
      .addCase(fetchTopShops.rejected, (state, action) => {
        state.loading = false;
        state.topShops.error = action.payload;
        if (action.payload === "Unauthorized - Please login again") {
          state.error = action.payload;
        }
      })
      // Top Products
      .addCase(fetchTopProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        console.log("Fetched Top Products Data:", action.payload);
        state.loading = false;
        state.topProducts = action.payload;
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.loading = false;
        state.topProducts.error = action.payload;
        if (action.payload === "Unauthorized - Please login again") {
          state.error = action.payload;
        }
      })
      // Top Categories
      .addCase(fetchTopCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopCategories.fulfilled, (state, action) => {
        console.log("Fetched Top Categories Data:", action.payload);
        state.loading = false;
        state.topCategories = action.payload;
      })
      .addCase(fetchTopCategories.rejected, (state, action) => {
        state.loading = false;
        state.topCategories.error = action.payload;
        if (action.payload === "Unauthorized - Please login again") {
          state.error = action.payload;
        }
      })
      // Top Sales
      .addCase(fetchTopSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopSales.fulfilled, (state, action) => {
        console.log("Fetched Top Sales Data:", action.payload);
        state.loading = false;
        state.topSales = {
          ...action.payload,
          usersCount: action.payload.data?.users_count || 0,
        };
      })
      .addCase(fetchTopSales.rejected, (state, action) => {
        state.loading = false;
        state.topSales.error = action.payload;
        if (action.payload === "Unauthorized - Please login again") {
          state.error = action.payload;
        }
      });
  },
});

export const { resetStatistics } = statisticsSlice.actions;
export default statisticsSlice.reducer;
