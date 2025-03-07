import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://asool-gifts.com/api";
const getToken = () => localStorage.getItem("token");

// Fetch all offers
export const fetchOffers = createAsyncThunk(
  "offers/fetchAll",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/offers`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error fetching offers"
      );
    }
  }
);

// Fetch a single offer by ID
export const fetchOfferById = createAsyncThunk(
  "offers/fetchOne",
  async (id, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/offers/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error fetching offer"
      );
    }
  }
);

// Create a new offer
export const createOffer = createAsyncThunk(
  "offers/create",
  async (offerData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/offers`, offerData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error creating offer"
      );
    }
  }
);

// Update an offer
export const updateOffer = createAsyncThunk(
  "offers/update",
  async ({ id, updateData }, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/offers/${id}`, updateData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error updating offer"
      );
    }
  }
);

// Delete an offer
export const deleteOffer = createAsyncThunk(
  "offers/delete",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`${API_URL}/offers/${id}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: "application/json",
        },
      });
      return id;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Error deleting offer"
      );
    }
  }
);

const offersSlice = createSlice({
  name: "offers",
  initialState: {
    offers: { data: [], status: null, error: null, statusCode: null },
    offer: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.loading = false;
        state.offers = action.payload;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOfferById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOfferById.fulfilled, (state, action) => {
        state.loading = false;
        state.offer = action.payload;
      })
      .addCase(fetchOfferById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        state.offers.data.push(action.payload);
      })
      .addCase(updateOffer.fulfilled, (state, action) => {
        const index = state.offers.data.findIndex(
          (offer) => offer.id === action.payload.id
        );
        if (index !== -1) state.offers.data[index] = action.payload;
      })
      .addCase(deleteOffer.fulfilled, (state, action) => {
        state.offers.data = state.offers.data.filter(
          (offer) => offer.id !== action.payload
        );
      });
  },
});

export default offersSlice.reducer;
