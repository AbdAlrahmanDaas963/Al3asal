import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const PREMIUM_API = `${BASE_URL}/order-settings/premium-percentage`;
const LOYALTY_API = `${BASE_URL}/loyalty-settings`;

const getToken = () => localStorage.getItem("token");

const getHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  Accept: "application/json",
});

// --- Premium Percentage Thunks ---
export const fetchPremiumPercentage = createAsyncThunk(
  "settings/fetchPremiumPercentage",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(PREMIUM_API, { headers: getHeaders() });
      return response.data.data.premium_percentage;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch premium percentage"
      );
    }
  }
);

export const updatePremiumPercentage = createAsyncThunk(
  "settings/updatePremiumPercentage",
  async (newPercentage, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${PREMIUM_API}/update`,
        { premium_percentage: newPercentage },
        { headers: getHeaders() }
      );
      return response.data.data.premium_percentage;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update premium percentage"
      );
    }
  }
);

// --- Points Per Dollar Thunks ---
export const fetchPointsPerDollar = createAsyncThunk(
  "settings/fetchPointsPerDollar",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${LOYALTY_API}/show`, {
        headers: getHeaders(),
      });
      return response.data.points_per_dollar;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch points per dollar"
      );
    }
  }
);

export const updatePointsPerDollar = createAsyncThunk(
  "settings/updatePointsPerDollar",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${LOYALTY_API}/update-rate`,
        formData,
        {
          headers: {
            ...getHeaders(),
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.points_per_dollar;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to update points per dollar"
      );
    }
  }
);

// --- Slice ---
const settingsSlice = createSlice({
  name: "premiumPercentage",
  initialState: {
    premiumPercentage: null,
    pointsPerDollar: null,
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
      // Premium
      .addCase(fetchPremiumPercentage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPremiumPercentage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.premiumPercentage = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchPremiumPercentage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updatePremiumPercentage.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePremiumPercentage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.premiumPercentage = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updatePremiumPercentage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Points Per Dollar
      .addCase(fetchPointsPerDollar.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchPointsPerDollar.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pointsPerDollar = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchPointsPerDollar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updatePointsPerDollar.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatePointsPerDollar.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pointsPerDollar = action.payload;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(updatePointsPerDollar.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { resetError } = settingsSlice.actions;
export default settingsSlice.reducer;
