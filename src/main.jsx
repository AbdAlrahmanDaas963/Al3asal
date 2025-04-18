import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider, CssBaseline } from "@mui/material";
import store from "./app/store.js";
import "./i18n/i18n.js";

import DevDimmensions from "./development/DevDimensions.jsx";
import getTheme from "./theme";
import setupAxiosInterceptors from "./utils/axiosInterceptor.js";

const theme = getTheme("ltr");

setupAxiosInterceptors();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </StrictMode>
);
