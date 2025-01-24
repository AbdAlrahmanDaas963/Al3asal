import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for creating a shop
export const addShop = createAsyncThunk(
  "shops/addShop",
  async (shopData, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const formData = new FormData();
      Object.keys(shopData).forEach((key) => {
        formData.append(key, shopData[key]);
      });
      const response = await axios.post(
        "https://asool-gifts.com/api/shops/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create shop");
    }
  }
);

// Async thunk for creating a shop
export const createShop = createAsyncThunk(
  "shops/createShop",
  async (shopData, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const formData = new FormData();
      Object.keys(shopData).forEach((key) =>
        formData.append(key, shopData[key])
      );
      const response = await axios.post(
        "https://asool-gifts.com/api/shops/create",
        formData,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for updating a shop
export const updateShop = createAsyncThunk(
  "shops/updateShop",
  async ({ id, shopData }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const formData = new FormData();
      Object.keys(shopData).forEach((key) =>
        formData.append(key, shopData[key])
      );
      const response = await axios.post(
        `https://asool-gifts.com/api/shops/update/${id}`,
        formData,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for deleting a shop
export const deleteShop = createAsyncThunk(
  "shops/deleteShop",
  async (id, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const response = await axios.delete(
        `https://asool-gifts.com/api/shops/destroy/${id}`,
        {
          headers: { Authorization: `Bearer ${auth.token}` },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const shopSlice = createSlice({
  name: "shops",
  initialState: { status: "idle", error: null, shops: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createShop.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createShop.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createShop.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateShop.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateShop.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(updateShop.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteShop.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteShop.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(deleteShop.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(addShop.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addShop.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.shops.push(action.payload);
      })
      .addCase(addShop.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default shopSlice.reducer;
