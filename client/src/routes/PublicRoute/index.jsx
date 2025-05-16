// src/routes/PublicRoute.jsx
import { useEffect } from "react";
import { useAuth } from "../../contexts/Auth";
import { useNavigate, useLocation } from "react-router-dom";
import paths from "../../constants/paths";

/**
 * Route wrapper component for public routes that redirects authenticated users
 * to appropriate pages based on their role
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {React.ReactNode|null}
 */
const PublicRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	useEffect(() => {
		if (isAuthenticated) {
			// Redirect to appropriate dashboard based on user role
			const destination = user?.role === "admin" ? paths.admin : paths.home;

			// Store the intended destination if user was trying to access a specific page
			const from = location.state?.from?.pathname || destination;

			navigate(from, { replace: true });
		}
	}, [isAuthenticated, navigate, user?.role, location.state]);

	// Only render children if user is not authenticated
	return isAuthenticated ? null : children;
};

export default PublicRoute;
