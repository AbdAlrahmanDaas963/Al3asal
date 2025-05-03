import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { saveAuthState } from "../../utils/authPersistence";

// const initialState = loadAuthState() || {
//   user: null,
//   token: null,
//   status: "idle",
//   error: null,
// };

const BASE_URL = import.meta.env.VITE_BASE_URL;
// const API_URL = `${BASE_URL}/dashboard/auth`; // For admin endpoint
const API_URL2 = `${BASE_URL}/auth`; // For regular endpoints

// Safe token getter with error handling
const getToken = () => {
  try {
    return localStorage.getItem("token") || null;
  } catch (error) {
    console.error("LocalStorage access error:", error);
    return null;
  }
};

const validateTokenClientSide = (token) => {
  if (!token) return false;

  try {
    // If JWT token (check if it has 3 parts separated by dots)
    if (token.split(".").length === 3) {
      const payload = JSON.parse(atob(token.split(".")[1]));

      // Check expiration if exists
      if (payload.exp && payload.exp < Date.now() / 1000) {
        return false;
      }
    }
    return true; // Valid token (or non-JWT token we can't validate)
  } catch {
    return false; // Invalid token format
  }
};

// export const validateToken = createAsyncThunk(
//   "auth/validateToken",
//   async (_, { getState, rejectWithValue }) => {
//     const token = getState().auth.token;
//     try {
//       const response = await axios.get(`${BASE_URL}/dashboard/validate-token`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

export const validateToken = createAsyncThunk(
  "auth/validateToken",
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !validateTokenClientSide(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return rejectWithValue("Invalid or expired token");
    }

    return JSON.parse(user);
  }
);

// Login (Admin endpoint)
// export const logIn = createAsyncThunk(
//   "auth/logIn",
//   async (credentials, { rejectWithValue }) => {
//     try {
//       const formData = new FormData();
//       formData.append("username", credentials.username);
//       formData.append("password", credentials.password);

//       const response = await axios.post(
//         `${BASE_URL}/dashboard/login`,
//         formData,
//         {
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       const { token, user } = response.data.data;
//       localStorage.setItem("token", token);
//       return { token, user };
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );
export const logIn = createAsyncThunk(
  "auth/logIn",
  async (credentials, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("username", credentials.username);
      formData.append("password", credentials.password);

      const response = await axios.post(
        `${BASE_URL}/dashboard/login`,
        formData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update to match your exact response structure
      const { token, user } = response.data.data; // Changed from response.data.data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user)); // Store user separately
      return { token, user };
    } catch (error) {
      return rejectWithValue({
        message: error.response?.data?.error || "Login failed",
        statusCode: error.response?.status,
      });
    }
  }
);

// Logout (Regular endpoint)
export const logOut = createAsyncThunk(
  "auth/logOut",
  async (_, { getState }) => {
    const token = getState().auth.token || getToken();

    try {
      await axios.post(
        `${API_URL2}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          timeout: 5000, // Fail fast if server unresponsive
        }
      );
    } catch (error) {
      console.warn("Logout API warning:", error.message);
      // Proceed with local logout even if API fails
    } finally {
      localStorage.removeItem("token");
    }
  }
);

const loadAuthState = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  return token
    ? {
        user: user ? JSON.parse(user) : null,
        token,
        status: validateTokenClientSide(token) ? "succeeded" : "idle",
        error: null,
      }
    : null;
};

const initialState = loadAuthState() || {
  user: null,
  token: null,
  status: "idle",
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    // Optional: For token refresh scenarios
    updateToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logIn.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.status = "succeeded";
        saveAuthState(state);
      })
      .addCase(logIn.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(logOut.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = "idle";
        localStorage.removeItem("authState");
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.user = action.payload;
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(validateToken.rejected, (state, action) => {
        state.user = null;
        state.token = null;
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetAuthState, updateToken } = authSlice.actions;
export default authSlice.reducer;
