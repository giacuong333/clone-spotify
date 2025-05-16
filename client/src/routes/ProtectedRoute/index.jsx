// src/routes/ProtectedRoute.jsx
import { useAuth } from "../../contexts/Auth";
import { Navigate, useLocation } from "react-router-dom";
import paths from "../../constants/paths";

/**
 * Route wrapper component that protects routes requiring authentication
 * and optional admin privileges
 *
 * @param {Object} props
 * @param {boolean} [props.adminOnly=false] - Whether the route requires admin privileges
 * @param {React.ReactNode} props.children - Child components to render
 * @returns {React.ReactNode}
 */
const ProtectedRoute = ({ adminOnly = false, children }) => {
	const { isAuthenticated, user } = useAuth();
	const location = useLocation();

	// If not authenticated, redirect to login page
	if (!isAuthenticated) {
		return <Navigate to={paths.login} state={{ from: location }} replace />;
	}

	// If admin privileges required but user is not admin, redirect to home
	if (adminOnly && user?.role !== "admin") {
		return <Navigate to={paths.home} replace />;
	}

	return children;
};

export default ProtectedRoute;
