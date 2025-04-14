import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const location = useLocation();

  // Sync Redux token with localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    // Optional: If you want to sync Redux with localStorage on mount
    // You would need to dispatch an action here to update Redux
    // if (storedToken && !token) {
    //   dispatch(setToken(storedToken));
    // }
  }, []);

  if (!token) {
    // Redirect to login page, preserving the location they came from
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
