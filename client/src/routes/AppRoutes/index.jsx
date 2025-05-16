// src/routes/AppRoutes.jsx
import { Suspense, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import { Spin } from "antd";
import routes from "../routes";
import ProtectedRoute from "../ProtectedRoute";
import PublicRoute from "../PublicRoute";
// import ErrorBoundary from "../components/ErrorBoundary";

/**
 * Custom loading component with a skeleton effect
 */
const PageLoader = () => (
	<div className='page-loading-container'>
		<Spin spinning tip='Loading...' size='large' className='page-spinner' />
	</div>
);

/**
 * Main router component that renders all application routes
 */
const AppRoutes = () => {
	/**
	 * Render a route based on its configuration
	 *
	 * @param {import('./index').RouteConfig} routeConfig
	 * @returns {JSX.Element}
	 */
	const renderRoute = useCallback(
		({ path, Layout, Page, isPublic, isAuthPage, isAdminPage, index }) => {
			// Wrap component based on authentication requirements
			let RouteElement = (
				// <ErrorBoundary
				// fallback={}>
				<Suspense fallback={<PageLoader />}>
					<Page />
				</Suspense>
				// </ErrorBoundary>
			);

			// Apply protection based on route type
			if (!isPublic) {
				RouteElement = (
					<ProtectedRoute adminOnly={isAdminPage}>
						{RouteElement}
					</ProtectedRoute>
				);
			}

			// Apply additional auth page handling (redirect logged-in users)
			if (isAuthPage) {
				RouteElement = <PublicRoute>{RouteElement}</PublicRoute>;
			}

			// Apply layout if specified
			if (Layout) {
				RouteElement = (
					<Suspense fallback={<PageLoader />}>
						<Layout>{RouteElement}</Layout>
					</Suspense>
				);
			}

			return (
				<Route
					key={path || `index-${index}`}
					path={path}
					index={index}
					element={RouteElement}
				/>
			);
		},
		[]
	);

	return (
		<Routes>
			{routes.map(renderRoute)}

			{/* Add a catch-all route for 404 handling */}
			<Route
				path='*'
				element={
					<div className='not-found'>
						<h1>404 - Page Not Found</h1>
						<p>The page you're looking for doesn't exist.</p>
					</div>
				}
			/>
		</Routes>
	);
};

export default AppRoutes;
