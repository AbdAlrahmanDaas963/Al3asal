import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_URL = `${BASE_URL}/order-settings/premium-percentage`;
const getToken = () => localStorage.getItem("token");

const getHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  Accept: "application/json",
});

export const fetchPremiumPercentage = createAsyncThunk(
  "premiumPercentage/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_URL, { headers: getHeaders() });
      return {
        value: response.data.data.premium_percentage,
        status: response.data.status,
        statusCode: response.data.statusCode,
      };
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.error || "Failed to fetch premium percentage",
        statusCode: error.response?.status,
      });
    }
  }
);

export const updatePremiumPercentage = createAsyncThunk(
  "premiumPercentage/update",
  async (newPercentage, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/update`,
        { premium_percentage: newPercentage },
        { headers: getHeaders() }
      );
      return {
        value: response.data.data.premium_percentage,
        status: response.data.status,
        statusCode: response.data.statusCode,
      };
    } catch (error) {
      return rejectWithValue({
        message:
          error.response?.data?.error || "Failed to update premium percentage",
        statusCode: error.response?.status,
      });
    }
  }
);

const premiumPercentageSlice = createSlice({
  name: "premiumPercentage",
  initialState: {
    value: null,
    status: null,
    statusCode: null,
    isLoading: false,
    error: null,
    lastUpdated: null,
  },
  reducers: {
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPremiumPercentage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPremiumPercentage.fulfilled, (state, action) => {
        state.isLoading = false;
        const valueChanged = state.value !== action.payload.value;

        if (!state.lastUpdated || valueChanged) {
          state.lastUpdated = new Date().toISOString();
        }

        state.value = action.payload.value;
        state.status = action.payload.status;
        state.statusCode = action.payload.statusCode;
      })
      .addCase(fetchPremiumPercentage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updatePremiumPercentage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePremiumPercentage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.value = action.payload.value;
        state.status = action.payload.status;
        state.statusCode = action.payload.statusCode;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updatePremiumPercentage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError } = premiumPercentageSlice.actions;
export default premiumPercentageSlice.reducer;
