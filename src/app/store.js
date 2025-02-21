import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/Auth/authSlice";
import userReducer from "../features/Auth/userSlice";
import ordersReducer from "../features/Orders/ordersSlice";
import shopReducer from "../features/Shops/shopSlice";
// import categoryReducer from "../features/category-old/categorySlice";

import categoryReducer from "../features/Categories/categorySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    orders: ordersReducer,
    shops: shopReducer,
    categories: categoryReducer,
  },
});

export default store;
