import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  Navigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";

import HomeDash from "./pages/HomeDash";
import Accounts from "./pages/Accounts";
import Orders from "./pages/Orders";
import Statistics from "./pages/Statistics";
import Products from "./pages/Products";
import Shops from "./pages/Shops";
import Category from "./pages/Category";

import { CssBaseline, Button, Box, Typography } from "@mui/material";
import getTheme from "./theme";

import { ThemeProvider } from "@mui/material/styles";

// ?
import { StylesProvider, jssPreset } from "@mui/styles";
import { create } from "jss";
import rtl from "jss-rtl";
import LanguageToggleButton from "./components/common/LanguageToggleButton";
import "./i18n/i18n";

// ?
import LanguageProvider, { LanguageContext } from "./contexts/LanguageContext";

import { DialogProvider } from "./components/common/Dialogs/reuse/DialogContext";

import ProtectedRoute from "./utils/ProtectedRoute";
import Login from "./features/Auth/Login";

// Create a JSS instance with RTL support
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

function App() {
  // const [direction, setDirection] = useState("ltr");

  // const theme = getTheme(direction);

  // useEffect(() => {
  //   document.dir = direction;
  // }, [direction]);

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
                  <Route path="statistics" element={<Statistics />} />
                  <Route path="products" element={<Products />} />
                  <Route path="shops" element={<Shops />} />
                  <Route path="category" element={<Category />} />
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

{
  /* <DialogProvider>
      <LanguageProvider>
        <LanguageContext.Consumer>
          {({ direction }) => (
            <ThemeProvider theme={getTheme(direction)}>
              <CssBaseline />
              <Router>
                
                <Routes>
                  
                  <Route path="*" element={<Navigate to="/login" replace />} />
                  <Route path="/" element={<LoginPage />} />
                  <Route path="/dashboard/*" element={<Dashboard />} />
                  <Route path="/dashboard/*" element={<Dashboard />}>
                    <Route index element={<HomeDash />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="accounts" element={<Accounts />} />
                    <Route path="statistics" element={<Statistics />} />
                    <Route path="products" element={<Products />} />
                    <Route path="shops" element={<Shops />} />
                    <Route path="category" element={<Category />} />
                  </Route>
                </Routes>
              </Router>
            </ThemeProvider>
          )}
        </LanguageContext.Consumer>
      </LanguageProvider>
    </DialogProvider> */
}

{
  /* <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{ textAlign: "center", marginTop: 4 }}>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
              {direction === "ltr"
                ? "Welcome to the Dashboard"
                : "مرحبًا بك في لوحة التحكم"}
            </Typography>
            <LanguageToggleButton setDirection={setDirection} />
          </Box>
          <Router>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/dashboard/*" element={<Dashboard />}>
                
        <Route index element={<HomeDash />} />
        <Route path="orders" element={<Orders />} />
        <Route path="accounts" element={<Accounts />} />
        <Route path="payments" element={<Payments />} />
        <Route path="products" element={<Products />} />
        <Route path="shops" element={<Shops />} />
        <Route path="category" element={<Category />} />
      </Route>
    </Routes>
  </Router>
</ThemeProvider> */
}
