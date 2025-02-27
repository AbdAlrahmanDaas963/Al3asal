import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import HomeDash from "./pages/HomeDash";
import Accounts from "./features/Dashboard/Accounts";
import Orders from "./pages/Orders";
import Shops from "./features/Shops/Shops";

import Statistics from "./pages/Statistics";
// import Products from "./pages/Products";
// import Category from "./pages/Category";
import AddShopForm from "./features/Shops/AddShopForm"; // Import the AddShopForm component

import { CssBaseline } from "@mui/material";
import getTheme from "./theme";
import { ThemeProvider } from "@mui/material/styles";
import { StylesProvider, jssPreset } from "@mui/styles";
import { create } from "jss";
import rtl from "jss-rtl";
import LanguageToggleButton from "./components/common/LanguageToggleButton";
import "./i18n/i18n";
import LanguageProvider, { LanguageContext } from "./contexts/LanguageContext";
import { DialogProvider } from "./components/common/Dialogs/reuse/DialogContext";
import ProtectedRoute from "./utils/ProtectedRoute";
import Login from "./features/Auth/Login";
import EditShopForm from "./features/Shops/EditShopForm";

import StatisticsTest from "./features/Statistics/StatisticsTest";

import Categories from "./features/Categories/Categories";
import AddCategoryForm from "./features/Categories/AddCategoryForm";

import EditCategory from "./features/Categories/EditCategory";

import Products from "./features/Products/Products";
import AddProductForm from "./features/Products/AddProductForm";
import EditProductForm from "./features/Products/EditProductForm";

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
                <Route path="/login" element={<Login />} />
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
                  <Route path="products/add" element={<AddProductForm />} />
                  <Route
                    path="products/edit/:productId"
                    element={<EditProductForm />}
                  />

                  <Route path="category" element={<Categories />} />
                  <Route
                    path="category/add"
                    element={<AddCategoryForm isEdit={false} />}
                  />
                  <Route
                    path="category/edit/:categoryId"
                    element={<EditCategory />}
                  />

                  <Route path="shops" element={<Shops />} />
                  <Route path="shops/add" element={<AddShopForm />} />
                  <Route path="shops/edit/:shopId" element={<EditShopForm />} />
                </Route>
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
