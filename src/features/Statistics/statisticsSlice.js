// src/features/Statistics/statisticsSlice.jsimport { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = import.meta.env.VITE_BASE_URL;
const API_BASE_URL2 = `${BASE_URL}/analytics`;

// Helper function to get token from localStorage
const getAuthConfig = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const initialState = {
  earnings: {
    data: [],
    status: false,
    error: null,
    statusCode: null,
  },
  topShops: {
    data: [],
    status: false,
    error: null,
    statusCode: null,
  },
  topProducts: {
    data: [],
    status: false,
    error: null,
    statusCode: null,
  },
  topCategories: {
    data: [],
    status: false,
    error: null,
    statusCode: null,
  },
  topSales: {
    data: null,
    usersCount: 0,
    status: false,
    error: null,
    statusCode: null,
  },
  loading: false,
  error: null,
};

// Async Thunks with token authentication
export const fetchEarnings = createAsyncThunk(
  "statistics/fetchEarnings",
  async (range, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL2}/earnings`, {
        ...getAuthConfig(),
        params: { range },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue("Unauthorized - Please login again");
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTopShops = createAsyncThunk(
  "statistics/fetchTopShops",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL2}/top-shops`,
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue("Unauthorized - Please login again");
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTopProducts = createAsyncThunk(
  "statistics/fetchTopProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL2}/top-products`,
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue("Unauthorized - Please login again");
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTopCategories = createAsyncThunk(
  "statistics/fetchTopCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL2}/top-categories`,
        getAuthConfig()
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue("Unauthorized - Please login again");
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchTopSales = createAsyncThunk(
  "statistics/fetchTopSales",
  async (range, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL2}/top-sales`, {
        ...getAuthConfig(),
        params: { range },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        return rejectWithValue("Unauthorized - Please login again");
      }
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const statisticsSlice = createSlice({
  name: "statistics",
  initialState,
  reducers: {
    resetStatistics: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Earnings
      .addCase(fetchEarnings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEarnings.fulfilled, (state, action) => {
        state.loading = false;
        state.earnings = action.payload;
      })
      .addCase(fetchEarnings.rejected, (state, action) => {
        state.loading = false;
        state.earnings.error = action.payload;
        if (action.payload === "Unauthorized - Please login again") {
          state.error = action.payload;
        }
      })

      // Top Shops
      .addCase(fetchTopShops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopShops.fulfilled, (state, action) => {
        state.loading = false;
        state.topShops = action.payload;
      })
      .addCase(fetchTopShops.rejected, (state, action) => {
        state.loading = false;
        state.topShops.error = action.payload;
        if (action.payload === "Unauthorized - Please login again") {
          state.error = action.payload;
        }
      })

      // Top Products
      .addCase(fetchTopProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.topProducts = action.payload;
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.loading = false;
        state.topProducts.error = action.payload;
        if (action.payload === "Unauthorized - Please login again") {
          state.error = action.payload;
        }
      })

      // Top Categories
      .addCase(fetchTopCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.topCategories = action.payload;
      })
      .addCase(fetchTopCategories.rejected, (state, action) => {
        state.loading = false;
        state.topCategories.error = action.payload;
        if (action.payload === "Unauthorized - Please login again") {
          state.error = action.payload;
        }
      })

      // Top Sales
      .addCase(fetchTopSales.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopSales.fulfilled, (state, action) => {
        state.loading = false;
        state.topSales = {
          ...action.payload,
          usersCount: action.payload.data?.users_count || 0,
        };
      })
      .addCase(fetchTopSales.rejected, (state, action) => {
        state.loading = false;
        state.topSales.error = action.payload;
        if (action.payload === "Unauthorized - Please login again") {
          state.error = action.payload;
        }
      });
  },
});

export const { resetStatistics } = statisticsSlice.actions;
export default statisticsSlice.reducer;
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// const BASE_URL = import.meta.env.VITE_BASE_URL;
// const API_BASE_URL = `${BASE_URL}/analytics`;
// const getToken = () => localStorage.getItem("token");

// // Helpers to unwrap responses
// const unwrapItems = (arr, key) =>
//   arr.map((item) => ({
//     ...item[key],
//     total_sold: item.total_sold,
//   }));

// // Thunks
// export const fetchTotalUsers = createAsyncThunk(
//   "statistics/fetchTotalUsers",
//   async (_, thunkAPI) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/total-users`, {
//         headers: {
//           Authorization: `Bearer ${getToken()}`,
//         },
//       });
//       const data = await response.json();
//       return data.total; // Assuming API returns { total: number }
//     } catch (error) {
//       console.error("Error fetching total users:", error);
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

// export const fetchTopSales = createAsyncThunk(
//   "statistics/fetchTopSales",
//   async (range, thunkAPI) => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/top-sales`,
//         // `${API_BASE_URL}/top-sales?range=${range}&limit=10`,
//         {
//           headers: {
//             Authorization: `Bearer ${getToken()}`,
//           },
//         }
//       );
//       const data = await response.json();
//       return data.data; // Assuming API returns { data: array }
//     } catch (error) {
//       console.error("Error fetching top sales:", error);
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

// export const fetchTopShops = createAsyncThunk(
//   "statistics/fetchTopShops",
//   async (range, thunkAPI) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/top-shops?range=${range}`, {
//         headers: {
//           Authorization: `Bearer ${getToken()}`,
//         },
//       });
//       const data = await response.json();
//       console.log("Top Shops Response:", data);
//       return unwrapItems(data.data, "shop");
//     } catch (error) {
//       console.error("Error fetching top shops:", error);
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

// export const fetchTopProducts = createAsyncThunk(
//   "statistics/fetchTopProducts",
//   async (range, thunkAPI) => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/top-products?range=${range}`,
//         {
//           headers: {
//             Authorization: `Bearer ${getToken()}`,
//           },
//         }
//       );
//       const data = await response.json();
//       console.log("Top Products Response:", data);
//       return unwrapItems(data.data, "product");
//     } catch (error) {
//       console.error("Error fetching top products:", error);
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

// export const fetchTopCategories = createAsyncThunk(
//   "statistics/fetchTopCategories",
//   async (range, thunkAPI) => {
//     try {
//       const response = await fetch(
//         `${API_BASE_URL}/top-categories?range=${range}`,
//         {
//           headers: {
//             Authorization: `Bearer ${getToken()}`,
//           },
//         }
//       );
//       const data = await response.json();
//       console.log("Top Categories Response:", data);
//       return unwrapItems(data.data, "category");
//     } catch (error) {
//       console.error("Error fetching top categories:", error);
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

// export const fetchEarnings = createAsyncThunk(
//   "statistics/fetchEarnings",
//   async (range, thunkAPI) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/earnings?range=${range}`, {
//         headers: {
//           Authorization: `Bearer ${getToken()}`,
//         },
//       });
//       const data = await response.json();
//       console.log("Earnings Response:", data);
//       return data.data; // already an array
//     } catch (error) {
//       console.error("Error fetching earnings:", error);
//       return thunkAPI.rejectWithValue(error.message);
//     }
//   }
// );

// // Initial state
// const initialState = {
//   topShops: [],
//   topProducts: [],
//   topCategories: [],
//   earnings: [],
//   totalUsers: 0,
//   topSales: [],
//   loading: false,
//   error: null,
// };

// // Slice
// const statisticsSlice = createSlice({
//   name: "statistics",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchTopShops.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchTopShops.fulfilled, (state, action) => {
//         state.topShops = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchTopShops.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       .addCase(fetchTopProducts.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchTopProducts.fulfilled, (state, action) => {
//         state.topProducts = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchTopProducts.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       .addCase(fetchTopCategories.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchTopCategories.fulfilled, (state, action) => {
//         state.topCategories = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchTopCategories.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       .addCase(fetchEarnings.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchEarnings.fulfilled, (state, action) => {
//         state.earnings = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchEarnings.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })
//       .addCase(fetchTotalUsers.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchTotalUsers.fulfilled, (state, action) => {
//         state.totalUsers = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchTotalUsers.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       })

//       .addCase(fetchTopSales.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(fetchTopSales.fulfilled, (state, action) => {
//         state.topSales = action.payload;
//         state.loading = false;
//       })
//       .addCase(fetchTopSales.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload;
//       });
//   },
// });

// export default statisticsSlice.reducer;
