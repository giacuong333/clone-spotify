import React, { useEffect } from "react";
import { useAuth } from "../../contexts/Auth";
import { useNavigate } from "react-router-dom";
import paths from "../../constants/paths";

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(paths.home, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? null : children;
};

export default PublicRoute;
