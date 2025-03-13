import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// Pages
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import HomeDash from "./pages/HomeDash";
import Statistics from "./pages/Statistics";

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
                <Route
                  path="/dashboard/*"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<HomeDash />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="accounts" element={<Accounts />} />
                  <Route path="statistics" element={<StatisticsTest />} />
                  <Route path="products" element={<Products />} />
                  <Route path="offers" element={<Offers />} />

                  {/* Product Management */}
                  <Route path="products/add" element={<AddProductForm />} />
                  <Route
                    path="products/edit/:productId"
                    element={<EditProductForm />}
                  />

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
                  <Route path="shops/edit/:shopId" element={<EditShopForm />} />
                </Route>

                {/* Redirect unknown routes */}
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
