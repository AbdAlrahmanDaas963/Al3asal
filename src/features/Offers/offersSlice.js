import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const getToken = () => localStorage.getItem("token");

// Enhanced error handling
const handleAsyncError = (error, thunkAPI) => {
  const errorData = {
    message:
      error.response?.data?.message || error.message || "An error occurred",
    status: error.response?.status,
    data: error.response?.data,
  };
  console.error("API Error:", errorData); // For debugging
  return thunkAPI.rejectWithValue(errorData);
};

// Helper to create headers
const getAuthHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
  Accept: "application/json",
});

// Thunks
export const fetchOffers = createAsyncThunk(
  "offers/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/dashboard/offers`, {
        headers: getAuthHeaders(),
      });
      return response.data;
    } catch (error) {
      return handleAsyncError(error, thunkAPI);
    }
  }
);

export const fetchOfferById = createAsyncThunk(
  "offers/fetchOne",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/dashboard/offers/${id}`, {
        headers: getAuthHeaders(),
      });
      return response.data.data || response.data;
    } catch (error) {
      return handleAsyncError(error, thunkAPI);
    }
  }
);

export const createOffer = createAsyncThunk(
  "offers/create",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/offers`, formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return handleAsyncError(error, thunkAPI);
    }
  }
);

export const updateOffer = createAsyncThunk(
  "offers/update",
  async ({ id, formData }, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/offers/${id}`, formData, {
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return handleAsyncError(error, thunkAPI);
    }
  }
);

export const deleteOffer = createAsyncThunk(
  "offers/delete",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${BASE_URL}/offers/${id}`, {
        headers: getAuthHeaders(),
      });
      return id;
    } catch (error) {
      return handleAsyncError(error, thunkAPI);
    }
  }
);

const initialState = {
  offers: {
    data: [],
    loading: false,
    error: null,
    status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
    lastUpdated: null,
  },
  currentOffer: {
    data: null,
    loading: false,
    error: null,
    status: "idle",
  },
  operation: {
    status: "idle", // For create/update/delete operations
    error: null,
    type: null, // 'create' | 'update' | 'delete'
  },
};

const offersSlice = createSlice({
  name: "offers",
  initialState,
  reducers: {
    resetOperationStatus: (state) => {
      state.operation = initialState.operation;
    },
    clearCurrentOffer: (state) => {
      state.currentOffer = initialState.currentOffer;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Offers
      .addCase(fetchOffers.pending, (state) => {
        state.offers.loading = true;
        state.offers.error = null;
        state.offers.status = "loading";
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.offers.loading = false;
        state.offers.data = action.payload.data || action.payload || [];
        state.offers.status = "succeeded";
        state.offers.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.offers.loading = false;
        state.offers.error = action.payload;
        state.offers.status = "failed";
      })

      // Fetch Single Offer
      .addCase(fetchOfferById.pending, (state) => {
        state.currentOffer.loading = true;
        state.currentOffer.error = null;
        state.currentOffer.status = "loading";
      })
      .addCase(fetchOfferById.fulfilled, (state, action) => {
        state.currentOffer.loading = false;
        state.currentOffer.data = action.payload;
        state.currentOffer.status = "succeeded";
      })
      .addCase(fetchOfferById.rejected, (state, action) => {
        state.currentOffer.loading = false;
        state.currentOffer.error = action.payload;
        state.currentOffer.status = "failed";
      })

      // Create Offer
      .addCase(createOffer.pending, (state) => {
        state.operation.status = "loading";
        state.operation.type = "create";
        state.operation.error = null;
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        state.operation.status = "succeeded";
        state.offers.data.unshift(action.payload.data || action.payload);
      })
      .addCase(createOffer.rejected, (state, action) => {
        state.operation.status = "failed";
        state.operation.error = action.payload;
      })

      // Update Offer
      .addCase(updateOffer.pending, (state) => {
        state.operation.status = "loading";
        state.operation.type = "update";
        state.operation.error = null;
      })
      .addCase(updateOffer.fulfilled, (state, action) => {
        state.operation.status = "succeeded";
        const updatedOffer = action.payload.data || action.payload;
        const index = state.offers.data.findIndex(
          (offer) => offer.id === updatedOffer.id
        );
        if (index !== -1) {
          state.offers.data[index] = updatedOffer;
        }
        if (state.currentOffer.data?.id === updatedOffer.id) {
          state.currentOffer.data = updatedOffer;
        }
      })
      .addCase(updateOffer.rejected, (state, action) => {
        state.operation.status = "failed";
        state.operation.error = action.payload;
      })

      // Delete Offer
      .addCase(deleteOffer.pending, (state) => {
        state.operation.status = "loading";
        state.operation.type = "delete";
        state.operation.error = null;
      })
      .addCase(deleteOffer.fulfilled, (state, action) => {
        state.operation.status = "succeeded";
        state.offers.data = state.offers.data.filter(
          (offer) => offer.id !== action.payload
        );
      })
      .addCase(deleteOffer.rejected, (state, action) => {
        state.operation.status = "failed";
        state.operation.error = action.payload;
      });
  },
});

export const { resetOperationStatus, clearCurrentOffer } = offersSlice.actions;
export default offersSlice.reducer;
