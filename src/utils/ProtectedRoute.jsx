import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ adminOnly = false }) => {
  const { token, user, status } = useSelector((state) => state.auth);

  if (status === "loading") {
    return <div>Loading...</div>; // Or a proper loading component
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user?.type !== "super") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
