import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_BASE_URL = `${BASE_URL}/dashboard/shops`;
const API_BASE_URL2 = `${BASE_URL}/shops`;

//? const getToken = () => localStorage.getItem("token");
const getToken = () => {
  try {
    return localStorage.getItem("token") || sessionStorage.getItem("token");
  } catch (error) {
    console.error("Token access error:", error);
    return null;
  }
};

// Helper function to transform shop data
const transformShopData = (shop) => {
  // If name is already properly formatted
  if (
    shop.name &&
    typeof shop.name === "object" &&
    "en" in shop.name &&
    "ar" in shop.name
  ) {
    return {
      ...shop,
      name: {
        en: shop.name.en || "",
        ar: shop.name.ar || "",
      },
    };
  }

  // Handle legacy or malformed data
  return {
    ...shop,
    name: {
      en: typeof shop.name === "string" ? shop.name : "",
      ar: typeof shop.name === "string" ? shop.name : "",
    },
  };
};

// Fetch all shops
export const fetchShops = createAsyncThunk(
  "shops/fetchShops",
  async (_, { getState, rejectWithValue }) => {
    try {
      const { shops } = getState();

      if (shops.lastFetched && Date.now() - shops.lastFetched < 300000) {
        return shops.data || shops.shops.data;
      }

      const response = await axios.get(API_BASE_URL, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      console.log("Shops API response:", response.data);

      const transformedData = response.data.data.map(transformShopData);

      return {
        ...response.data,
        data: transformedData,
      };
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
      const data = new FormData();

      // Validate names before sending
      if (!formData.name.en || !formData.name.ar) {
        throw new Error("Both English and Arabic names are required");
      }

      data.append("name[en]", formData.name.en.trim());
      data.append("name[ar]", formData.name.ar.trim());
      data.append("is_interested", formData.is_interested);

      if (formData.image) {
        data.append("image", formData.image);
      }

      console.log("Sending to API:", {
        // Debug log
        en: formData.name.en,
        ar: formData.name.ar,
        hasImage: !!formData.image,
      });

      const response = await axios.post(`${API_BASE_URL2}/create`, data, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("API Response:", response.data); // Debug log
      return transformShopData(response.data.data);
    } catch (error) {
      console.error(
        "Create shop error:",
        error.response?.data || error.message
      );
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update a shop
export const updateShop = createAsyncThunk(
  "shops/updateShop",
  async ({ shop_id, formData }, { rejectWithValue }) => {
    try {
      const data = new FormData();

      // Handle multilingual name
      data.append("name[en]", formData.name.en);
      data.append("name[ar]", formData.name.ar);
      data.append("is_interested", formData.is_interested);

      if (formData.image) {
        if (formData.image instanceof File) {
          data.append("image", formData.image);
        } else if (typeof formData.image === "string") {
          // If it's a string (existing image URL), we might not need to send it
          // Or you can add logic to handle image updates differently
        }
      }

      const response = await axios.post(
        `${API_BASE_URL2}/update/${shop_id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return transformShopData(response.data.data);
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
      await axios.delete(`${API_BASE_URL2}/destroy/${shopId}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });
      return shopId;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to delete shop");
    }
  }
);

// Fetch shop by ID
export const fetchShopById = createAsyncThunk(
  "shops/fetchShopById",
  async (shopId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL2}/${shopId}`);
      return transformShopData(response.data.data);
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch shop");
    }
  }
);

const shopSlice = createSlice({
  name: "shops",
  initialState: {
    data: [],
    shops: {
      data: [],
      status: true,
      error: null,
      statusCode: 200,
    },
    status: "idle",
    error: null,
    selectedShop: null,
    lastFetched: null,
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
        state.data = action.payload.data;
        state.shops.data = action.payload.data;
        state.lastFetched = Date.now();
      })
      .addCase(fetchShops.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(createShop.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createShop.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data.unshift(action.payload);
      })
      .addCase(createShop.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateShop.pending, (state) => {
        state.status = "loading";
      })
      .addCase(updateShop.fulfilled, (state, action) => {
        state.status = "succeeded";
        const index = state.data.findIndex(
          (shop) => shop.id === action.payload.id
        );
        if (index !== -1) {
          state.data[index] = action.payload;
          state.shops.data[index] = action.payload;
        }
      })
      .addCase(updateShop.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(deleteShop.pending, (state) => {
        state.status = "loading";
      })
      .addCase(deleteShop.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = state.data.filter((shop) => shop.id !== action.payload);
        state.shops.data = state.shops.data.filter(
          (shop) => shop.id !== action.payload
        );
      })
      .addCase(deleteShop.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
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
