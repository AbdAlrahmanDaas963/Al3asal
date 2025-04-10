import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

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

// Login (Admin endpoint)
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
          },
        }
      );
      const { token, user } = response.data.data;
      localStorage.setItem("token", token);
      return { token, user };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
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

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: getToken(),
    status: "idle",
    error: null,
    lastFetched: null,
  },
  reducers: {
    resetAuthState: (state) => {
      state.user = null;
      state.token = null;
      state.status = "idle";
      state.error = null;
      localStorage.removeItem("token");
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
        state.status = "succeeded";
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(logIn.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(logOut.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.status = "idle";
        state.error = null;
      });
  },
});

export const { resetAuthState, updateToken } = authSlice.actions;
export default authSlice.reducer;
