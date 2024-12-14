import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";

import HomeDash from "./pages/HomeDash";
import Accounts from "./pages/Accounts";
import Orders from "./pages/Orders";
import Payments from "./pages/Payments";
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
import "./i18n";

// Create a JSS instance with RTL support
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

function App() {
  const [direction, setDirection] = useState("ltr");

  const theme = getTheme(direction);

  useEffect(() => {
    document.dir = direction;
  }, [direction]);

  return (
    <ThemeProvider theme={theme}>
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
            {/* Nested routes for dashboard */}
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
    </ThemeProvider>
  );
}

export default App;
