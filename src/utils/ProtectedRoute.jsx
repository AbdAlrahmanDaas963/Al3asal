// utils/ProtectedRoute.jsx
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const { token } = useSelector((state) => state.auth);

  if (!token) {
    // User not logged in, redirect to login
    return <Navigate to="/login" replace />;
  }

  // User is logged in, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
