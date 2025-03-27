import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const getToken = () => localStorage.getItem("token");

// Helper for consistent error handling
const handleAsyncError = (error, thunkAPI) => {
  return thunkAPI.rejectWithValue({
    message: error.response?.data?.message || "An error occurred",
    status: error.response?.status,
    data: error.response?.data,
  });
};

// Thunks with enhanced error handling
export const fetchOffers = createAsyncThunk(
  "offers/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${BASE_URL}/offers`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
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
      console.log(`Fetching offer with ID: ${id}`); // Debug log
      const response = await axios.get(`${BASE_URL}/offers/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
      });

      console.log("API Response:", response.data); // Debug log

      if (!response.data) {
        throw new Error("Received empty response");
      }

      // Handle both response.data and response.data.data
      const offerData = response.data.data || response.data;

      if (!offerData) {
        throw new Error("Offer data not found in response");
      }

      return offerData;
    } catch (error) {
      console.error("Error fetching offer:", error); // Debug log
      if (error.response?.status === 404) {
        return thunkAPI.rejectWithValue({
          message: "Offer not found",
          status: 404,
        });
      }
      return thunkAPI.rejectWithValue({
        message: error.message,
        status: error.response?.status,
      });
    }
  }
);

export const createOffer = createAsyncThunk(
  "offers/create",
  async (offerData, thunkAPI) => {
    try {
      const response = await axios.post(`${BASE_URL}/offers`, offerData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
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
  async ({ id, updateData }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/offers/${id}`,
        updateData,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
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
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
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
    status: "idle",
  },
  currentOffer: {
    data: null,
    loading: false,
    error: null,
    status: "idle",
  },
  operationStatus: "idle",
};

const offersSlice = createSlice({
  name: "offers",
  initialState,
  reducers: {
    resetOperationStatus: (state) => {
      state.operationStatus = "idle";
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
        state.offers.data = action.payload.data || [];
        state.offers.pagination = action.payload.pagination || null;
        state.offers.lastFetched = Date.now();
        state.offers.status = "succeeded";
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.offers.loading = false;
        state.offers.error = action.payload;
        state.offers.status = "failed";
      })

      // Fetch Single Offer
      .addCase(fetchOfferById.pending, (state) => {
        state.currentOffer = {
          data: null,
          loading: true,
          error: null,
          status: "loading",
        };
      })
      .addCase(fetchOfferById.fulfilled, (state, action) => {
        state.currentOffer = {
          data: action.payload,
          loading: false,
          error: null,
          status: "succeeded",
        };
      })
      .addCase(fetchOfferById.rejected, (state, action) => {
        state.currentOffer = {
          data: null,
          loading: false,
          error: action.payload,
          status: "failed",
        };
      })

      // Create Offer
      .addCase(createOffer.pending, (state) => {
        state.operationStatus = "loading";
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        state.operationStatus = "succeeded";
        state.offers.data.unshift(action.payload); // Add new offer at beginning
      })
      .addCase(createOffer.rejected, (state, action) => {
        state.operationStatus = "failed";
        state.offers.error = action.payload;
      })

      // Update Offer
      .addCase(updateOffer.pending, (state) => {
        state.operationStatus = "loading";
      })
      .addCase(updateOffer.fulfilled, (state, action) => {
        state.operationStatus = "succeeded";
        const index = state.offers.data.findIndex(
          (offer) => offer.id === action.payload.id
        );
        if (index !== -1) {
          state.offers.data[index] = action.payload;
        }
        if (state.currentOffer.data?.id === action.payload.id) {
          state.currentOffer.data = action.payload;
        }
      })
      .addCase(updateOffer.rejected, (state, action) => {
        state.operationStatus = "failed";
        state.offers.error = action.payload;
      })

      // Delete Offer
      .addCase(deleteOffer.pending, (state) => {
        state.operationStatus = "loading";
      })
      .addCase(deleteOffer.fulfilled, (state, action) => {
        state.operationStatus = "succeeded";
        state.offers.data = state.offers.data.filter(
          (offer) => offer.id !== action.payload
        );
      })
      .addCase(deleteOffer.rejected, (state, action) => {
        state.operationStatus = "failed";
        state.offers.error = action.payload;
      });
  },
});

export const { resetOperationStatus, clearCurrentOffer } = offersSlice.actions;
export default offersSlice.reducer;
