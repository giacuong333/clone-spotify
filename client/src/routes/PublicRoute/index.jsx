import React, { useEffect } from "react";
import { useAuth } from "../../contexts/Auth";
import { useNavigate } from "react-router-dom";
import paths from "../../constants/paths";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(user?.role === "admin" ? paths.admin : paths.home, {
        replace: true,
      });
    }
  }, [isAuthenticated, navigate, user?.role]);

  return isAuthenticated ? null : children;
};

export default PublicRoute;
