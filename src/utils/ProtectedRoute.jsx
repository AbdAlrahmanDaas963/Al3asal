import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { validateToken } from "../features/Auth/authSlice";

const ProtectedRoute = ({ adminOnly = false }) => {
  const { token, user, status, error } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(validateToken());
    }
  }, [dispatch, token]);

  // Loading state
  if (token && status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Checking session...</p>
      </div>
    );
  }

  // No token - redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Token exists but validation failed
  if (error) {
    return <Navigate to="/login" replace state={{ from: "expired" }} />;
  }

  // Admin check
  if (adminOnly && user?.type !== "super") {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
