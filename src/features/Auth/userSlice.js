import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

// Async thunk for adding a user
// export const addUser = createAsyncThunk(
//   "users/addUser",
//   async (userData, { getState, rejectWithValue }) => {
//     const { auth } = getState();
//     try {
//       const response = await axios.post(
//         `${BASE_URL}/dashboard/work-users`,
//         userData,
//         {
//           headers: {
//             Authorization: `Bearer ${auth.token}`,
//             Accept: "application/json",
//           },
//         }
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );
export const addUser = createAsyncThunk(
  "users/addUser",
  async (userData, { getState, rejectWithValue }) => {
    const { auth } = getState();
    try {
      // 1. Create FormData object
      const formData = new FormData();
      formData.append("username", userData.username);
      formData.append("password", userData.password);
      formData.append("is_admin", userData.is_admin);

      // 2. Send as multipart/form-data
      const response = await axios.post(
        `${BASE_URL}/dashboard/work-users`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
            Accept: "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add user");
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState: {
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(addUser.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(addUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default userSlice.reducer;
