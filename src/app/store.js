import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/Auth/authSlice";
import userReducer from "../features/Auth/userSlice";
import ordersReducer from "../features/Orders/ordersSlice";
import shopReducer from "../features/Shops/shopSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    orders: ordersReducer,
    shops: shopReducer,
  },
});

export default store;
