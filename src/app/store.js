import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/Auth/authSlice";
import userReducer from "../features/Auth/userSlice";
import ordersReducer from "../features/Orders/ordersSlice";
import shopReducer from "../features/Shops/shopSlice";

import categoryReducer from "../features/Categories/categorySlice";
import productSlice from "../features/Products/productsSlice";

import statisticsReducer from "../features/Statistics/statisticsSlice";
import offersReducer from "../features/Offers/offersSlice"; // Import the offers slice

import premiumPercentageReducer from "../features/PremiumSettings/premiumPercentageSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    orders: ordersReducer,
    shops: shopReducer,
    categories: categoryReducer,
    products: productSlice,
    statistics: statisticsReducer,
    offers: offersReducer,
    premiumPercentage: premiumPercentageReducer,
  },
});

export default store;
