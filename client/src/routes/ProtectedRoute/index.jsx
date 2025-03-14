import React, { useEffect } from "react";
import { useAuth } from "../../contexts/Auth";
import { useNavigate } from "react-router-dom";
import paths from "../../constants/paths";

const ProtectedRoute = ({ adminOnly, children }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(paths.login, { replace: true });
      return;
    }
    if (adminOnly && user?.role !== "admin") {
      navigate(paths.home, { replace: true });
      return;
    }
  }, [isAuthenticated, navigate, user?.role, adminOnly, user]);

  return isAuthenticated ? children : null;
};

export default ProtectedRoute;
