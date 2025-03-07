// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// export const fetchShops = createAsyncThunk(
//   "shops/fetchShops",
//   async (_, { getState, rejectWithValue }) => {
//     const { auth } = getState();
//     try {
//       const response = await axios.get(API_BASE_URL, {
//         headers: {
//           Authorization: `Bearer ${auth.token}`,
//           Accept: "application/json",
//         },
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || "Failed to fetch shops");
//     }
//   }
// );

// export const fetchShopById = createAsyncThunk(
//   "shops/fetchShopById",
//   async (id, { getState, rejectWithValue }) => {
//     const { auth } = getState();
//     try {
//       const response = await axios.get(`${API_BASE_URL}/${id}`, {
//         headers: {
//           Authorization: `Bearer ${auth.token}`,
//           Accept: "application/json",
//         },
//       });
//       console.log("Shop data fetched:", response.data);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || "Failed to fetch shop");
//     }
//   }
// );

// export const createShop = createAsyncThunk(
//   "shops/createShop",
//   async (shopData, { getState, rejectWithValue }) => {
//     const { auth } = getState();
//     try {
//       const formData = new FormData();
//       Object.keys(shopData).forEach((key) =>
//         formData.append(key, shopData[key])
//       );
//       const response = await axios.post(`${API_BASE_URL}/create`, formData, {
//         headers: {
//           Authorization: `Bearer ${auth.token}`,
//           "Content-Type": "multipart/form-data",
//           Accept: "application/json",
//         },
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || "Failed to create shop");
//     }
//   }
// );

// export const addShop = createAsyncThunk(
//   "shops/addShop",
//   async (shopData, { getState, rejectWithValue }) => {
//     const { auth } = getState();
//     try {
//       const formData = new FormData();
//       Object.keys(shopData).forEach((key) =>
//         formData.append(key, shopData[key])
//       );
//       const response = await axios.post(`${API_BASE_URL}/create`, formData, {
//         headers: {
//           Authorization: `Bearer ${auth.token}`,
//           "Content-Type": "multipart/form-data",
//           Accept: "application/json",
//         },
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || "Failed to add shop");
//     }
//   }
// );

// export const updateShop = createAsyncThunk(
//   "shops/updateShop",
//   async ({ id, shopData }, { getState, rejectWithValue }) => {
//     const { auth } = getState();
//     try {
//       const formData = new FormData();

//       // Debugging: Log shopData before appending
//       console.log("shopData received:", shopData);

//       // Ensure name exists and is an object
//       if (shopData.name && typeof shopData.name === "object") {
//         if (shopData.name.en) formData.append("name[en]", shopData.name.en);
//         if (shopData.name.ar) formData.append("name[ar]", shopData.name.ar);
//       } else {
//         console.error("shopData.name is missing or incorrect:", shopData.name);
//       }

//       // Convert is_interested to string format
//       formData.append("is_interested", shopData.is_interested ? "1" : "0");

//       // Append image only if it's a File object
//       if (shopData.image instanceof File) {
//         formData.append("image", shopData.image);
//       }

//       // Debugging: Log FormData values
//       console.log("FormData being sent:", Object.fromEntries(formData));

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
//       console.error("Error response:", error.response?.data);
//       return rejectWithValue(
//         error.response?.data || { message: "Failed to update shop" }
//       );
//     }
//   }
// );

// export const deleteShop = createAsyncThunk(
//   "shops/deleteShop",
//   async (id, { getState, rejectWithValue }) => {
//     const { auth } = getState();
//     try {
//       const response = await axios.delete(`${API_BASE_URL}/destroy/${id}`, {
//         headers: {
//           Authorization: `Bearer ${auth.token}`,
//           Accept: "application/json",
//         },
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || "Failed to delete shop");
//     }
//   }
// );

// const shopSlice = createSlice({
//   name: "shops",
//   initialState: {
//     status: "idle",
//     error: null,
//     shops: { data: [], status: null, error: null, statusCode: null },
//     selectedShop: null,
//   },
//   reducers: {
//     resetStatus: (state) => {
//       state.status = "idle";
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(createShop.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(createShop.fulfilled, (state) => {
//         state.status = "succeeded";
//       })
//       .addCase(createShop.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(addShop.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(addShop.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         if (Array.isArray(state.shops.data)) {
//           state.shops.data.push(action.payload);
//         } else {
//           state.shops.data = [action.payload];
//         }
//       })
//       .addCase(addShop.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(fetchShops.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchShops.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.shops = action.payload;
//       })
//       .addCase(fetchShops.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(fetchShopById.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(fetchShopById.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.selectedShop = action.payload;
//         console.log("Selected shop set in state:", action.payload);
//       })
//       .addCase(fetchShopById.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       .addCase(updateShop.pending, (state) => {
//         state.status = "loading";
//       })
//       .addCase(updateShop.fulfilled, (state) => {
//         state.status = "succeeded";
//       })
//       .addCase(updateShop.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       });
//   },
// });

// export const { resetStatus } = shopSlice.actions;

// export default shopSlice.reducer;

// !---------------------------------------------------------------------------------------
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "https://asool-gifts.com/api/shops";

// Fetch all shops
export const fetchShops = createAsyncThunk(
  "shops/fetchShops",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch shops");
    }
  }
);

// Create a shop
export const createShop = createAsyncThunk(
  "shops/createShop",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/create`, formData, {
        headers: {
          Authorization: `Bearer YOUR_ACCESS_TOKEN`,
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to create shop");
    }
  }
);

// Update a shop
export const updateShop = createAsyncThunk(
  "shops/updateShop",
  async ({ shopId, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/update/${shopId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer YOUR_ACCESS_TOKEN`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update shop");
    }
  }
);

// Delete a shop
export const deleteShop = createAsyncThunk(
  "shops/deleteShop",
  async (shopId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/destroy/${shopId}`, {
        headers: {
          Authorization: `Bearer YOUR_ACCESS_TOKEN`,
        },
      });
      return shopId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete shop");
    }
  }
);

// Fetch shop by ID (Fixed URL)
export const fetchShopById = createAsyncThunk(
  "shops/fetchShopById",
  async (shopId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${shopId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch shop");
    }
  }
);

// Create shop slice
const shopSlice = createSlice({
  name: "shops",
  initialState: {
    shops: [],
    status: "idle",
    error: null,
    selectedShop: null,
  },
  reducers: {
    resetStatus: (state) => {
      state.status = "idle";
      state.error = null;
    },
    setSelectedShop: (state, action) => {
      state.selectedShop = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(createShop.fulfilled, (state, action) => {
        state.shops.push(action.payload);
        state.status = "idle"; // Reset status
      })
      .addCase(updateShop.fulfilled, (state, action) => {
        const index = state.shops.findIndex(
          (shop) => shop.id === action.payload.id
        );
        if (index !== -1) {
          state.shops[index] = action.payload;
        }
        state.status = "idle"; // Reset status
      })
      .addCase(deleteShop.fulfilled, (state, action) => {
        state.shops = state.shops.filter((shop) => shop.id !== action.payload);
        state.status = "idle"; // Reset status
      })
      .addCase(fetchShopById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchShopById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedShop = action.payload;
      })
      .addCase(fetchShopById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetStatus, setSelectedShop } = shopSlice.actions;
export default shopSlice.reducer;
