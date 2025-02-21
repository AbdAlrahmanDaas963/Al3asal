import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://asool-gifts.com/api/shops";

export const fetchShops = createAsyncThunk(
  "shops/fetchShops",
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const response = await axios.get(API_BASE_URL, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch shops");
    }
  }
);

export const fetchShopById = createAsyncThunk(
  "shops/fetchShopById",
  async (id, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          Accept: "application/json",
        },
      });
      console.log("Shop data fetched:", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch shop");
    }
  }
);

export const createShop = createAsyncThunk(
  "shops/createShop",
  async (shopData, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const formData = new FormData();
      Object.keys(shopData).forEach((key) =>
        formData.append(key, shopData[key])
      );
      const response = await axios.post(`${API_BASE_URL}/create`, formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create shop");
    }
  }
);

export const addShop = createAsyncThunk(
  "shops/addShop",
  async (shopData, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const formData = new FormData();
      Object.keys(shopData).forEach((key) =>
        formData.append(key, shopData[key])
      );
      const response = await axios.post(`${API_BASE_URL}/create`, formData, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "multipart/form-data",
          Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add shop");
    }
  }
);

export const updateShop = createAsyncThunk(
  "shops/updateShop",
  async ({ id, shopData }, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const formData = new FormData();

      // Debugging: Log shopData before appending
      console.log("shopData received:", shopData);

      // Ensure name exists and is an object
      if (shopData.name && typeof shopData.name === "object") {
        if (shopData.name.en) formData.append("name[en]", shopData.name.en);
        if (shopData.name.ar) formData.append("name[ar]", shopData.name.ar);
      } else {
        console.error("shopData.name is missing or incorrect:", shopData.name);
      }

      // Convert is_interested to string format
      formData.append("is_interested", shopData.is_interested ? "1" : "0");

      // Append image only if it's a File object
      if (shopData.image instanceof File) {
        formData.append("image", shopData.image);
      }

      // Debugging: Log FormData values
      console.log("FormData being sent:", Object.fromEntries(formData));

      const response = await axios.post(
        `https://asool-gifts.com/api/shops/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error response:", error.response?.data);
      return rejectWithValue(
        error.response?.data || { message: "Failed to update shop" }
      );
    }
  }
);

export const deleteShop = createAsyncThunk(
  "shops/deleteShop",
  async (id, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      const response = await axios.delete(`${API_BASE_URL}/destroy/${id}`, {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          Accept: "application/json",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete shop");
    }
  }
);

const shopSlice = createSlice({
  name: "shops",
  initialState: {
    status: "idle",
    error: null,
    shops: { data: [], status: null, error: null, statusCode: null },
    selectedShop: null,
  },
  reducers: {
    resetStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
  },
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
      .addCase(addShop.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addShop.fulfilled, (state, action) => {
        state.status = "succeeded";
        if (Array.isArray(state.shops.data)) {
          state.shops.data.push(action.payload);
        } else {
          state.shops.data = [action.payload];
        }
      })
      .addCase(addShop.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchShops.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchShops.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.shops = action.payload;
      })
      .addCase(fetchShops.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchShopById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchShopById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedShop = action.payload;
        console.log("Selected shop set in state:", action.payload);
      })
      .addCase(fetchShopById.rejected, (state, action) => {
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
      });
  },
});

export const { resetStatus } = shopSlice.actions;

export default shopSlice.reducer;

// export const updateShop = createAsyncThunk(
//   "shops/updateShop",
//   async ({ id, shopData }, { getState, rejectWithValue }) => {
//     const { auth } = getState();
//     try {
//       const formData = new FormData();
//       formData.append("name", shopData.name);
//       formData.append("is_interested", shopData.is_interested);
//       if (shopData.image) {
//         formData.append("image", shopData.image);
//       }
//       const response = await axios.put(
//         `https://asool-gifts.com/api/shops/update/${id}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${auth.token}`,
//             "Content-Type": "multipart/form-data",
//             Accept: "application/json",
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       // Return the error response from the backend
//       return rejectWithValue(
//         error.response?.data || { message: "Failed to update shop" }
//       );
//     }
//   }
// );

// export const updateShop = createAsyncThunk(
//   "shops/updateShop",
//   async ({ id, shopData }, { getState, rejectWithValue }) => {
//     const { auth } = getState();
//     try {
//       const formData = new FormData();
//       formData.append("name", shopData.name); // Updated to match the backend
//       formData.append("is_interested", shopData.is_interested); // Updated to match the backend
//       if (shopData.image) {
//         formData.append("image", shopData.image);
//       }
//       const response = await axios.post(
//         `https://asool-gifts.com/api/shops/update/${id}`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${auth.token}`,
//             "Content-Type": "multipart/form-data",
//             Accept: "application/json",
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || "Failed to update shop");
//     }
//   }
// );
