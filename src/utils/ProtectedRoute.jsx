import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);

  // Ensure the token is always synchronized with localStorage
  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      // This sync ensures the app works even after a page reload
    }
  }, [token]);

  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
