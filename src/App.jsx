import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Pages
import Dashboard from "./pages/Dashboard";
import HomeDash from "./pages/HomeDash";

// Features
import Accounts from "./features/Dashboard/Accounts";
import Shops from "./features/Shops/Shops";
import AddShopForm from "./features/Shops/AddShopForm";
import EditShopForm from "./features/Shops/EditShopForm";
import Categories from "./features/Categories/Categories";
import AddCategoryForm from "./features/Categories/AddCategoryForm";
import EditCategory from "./features/Categories/EditCategory";
import Orders from "./features/Orders/Orders";
import Products from "./features/Products/Products";
import AddProductForm from "./features/Products/AddProductForm";
import EditProductForm from "./features/Products/EditProductForm";
import Offers from "./features/Offers/Offers";
import EditOfferForm from "./features/Offers/EditOfferForm";
import StatisticsTest from "./features/Statistics/StatisticsTest";
import Login from "./features/Auth/Login";

// Theme & Styles
import { CssBaseline, ThemeProvider } from "@mui/material";
import getTheme from "./theme";
import { StylesProvider, jssPreset } from "@mui/styles";
import { create } from "jss";
import rtl from "jss-rtl";

// Contexts & Utils
import "./i18n/i18n";
import { DialogProvider } from "./components/common/Dialogs/reuse/DialogContext";
import LanguageProvider, { LanguageContext } from "./contexts/LanguageContext";
import ProtectedRoute from "./utils/ProtectedRoute";
import AddOfferForm from "./features/Offers/AddOfferForm";

// Create a JSS instance with RTL support
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

function App() {
  return (
    <DialogProvider>
      <LanguageProvider>
        <LanguageContext.Consumer>
          {({ direction }) => (
            <ThemeProvider theme={getTheme(direction)}>
              <CssBaseline />
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/dashboard" element={<Dashboard />}>
                    <Route index element={<HomeDash />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="accounts" element={<Accounts />} />
                    <Route path="statistics" element={<StatisticsTest />} />

                    {/* Products Routes */}
                    <Route path="products" element={<Products />} />
                    <Route path="products/add" element={<AddProductForm />} />
                    <Route
                      path="products/edit/:productId"
                      element={<EditProductForm />}
                    />

                    {/* Offers Routes */}
                    <Route path="offers" element={<Offers />} />
                    <Route path="offers/add" element={<AddOfferForm />} />
                    <Route path="offers/edit" element={<EditOfferForm />} />

                    {/* Category Management */}
                    <Route path="category" element={<Categories />} />
                    <Route
                      path="category/add"
                      element={<AddCategoryForm isEdit={false} />}
                    />
                    <Route
                      path="category/edit/:categoryId"
                      element={<EditCategory />}
                    />

                    {/* Shop Management */}
                    <Route path="shops" element={<Shops />} />
                    <Route path="shops/add" element={<AddShopForm />} />
                    <Route
                      path="shops/edit/:shopId"
                      element={<EditShopForm />}
                    />
                  </Route>
                </Route>

                {/* Redirect unknown routes to login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </ThemeProvider>
          )}
        </LanguageContext.Consumer>
      </LanguageProvider>
    </DialogProvider>
  );
}

export default App;
