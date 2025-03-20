import React from "react";
import { useAuth } from "../../contexts/Auth";
import { Navigate } from "react-router-dom";
import paths from "../../constants/paths";

const ProtectedRoute = ({ adminOnly, children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={paths.login} replace />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to={paths.home} replace />;
  }

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
