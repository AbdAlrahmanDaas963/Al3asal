const API_BASE_URL = "https://asool-gifts.com/api/analytics";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Replace with your correct API base URL
// const API_BASE_URL = "http://127.0.0.1:8000/api/analytics"; // or use production URL
const TEST_TOKEN = "493|lAPTaFUMAlKEpLiwugJ0neemfcUgBnSwmBipFiCIe87a4d3e"; // Ensure the correct token

const fetchStatistics = (endpoint) =>
  createAsyncThunk(`statistics/${endpoint}`, async (_, { rejectWithValue }) => {
    try {
      console.log(`Fetching: ${API_BASE_URL}/${endpoint}`);
      const response = await axios.get(`${API_BASE_URL}/${endpoint}`, {
        headers: {
          Authorization: `Bearer ${TEST_TOKEN}`, // Correct token
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error.response?.data);
      return rejectWithValue(
        error.response?.data || `Failed to fetch ${endpoint}`
      );
    }
  });

// Fetch data for different statistics
export const fetchTopShops = fetchStatistics("top-shops");
export const fetchTopCategories = fetchStatistics("top-categories");
export const fetchTopProducts = fetchStatistics("top-products");
export const fetchEarnings = fetchStatistics("earnings?range=weekly");

const statisticsSlice = createSlice({
  name: "statistics",
  initialState: {
    status: "idle",
    error: null,
    topShops: [],
    topCategories: [],
    topProducts: [],
    earnings: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopShops.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTopShops.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.topShops = action.payload;
      })
      .addCase(fetchTopShops.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchTopCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTopCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.topCategories = action.payload;
      })
      .addCase(fetchTopCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchTopProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.topProducts = action.payload;
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchEarnings.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEarnings.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.earnings = action.payload;
      })
      .addCase(fetchEarnings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default statisticsSlice.reducer;
