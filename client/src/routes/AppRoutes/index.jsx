import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import routes from "../routes";
import { Spin } from "antd";
import ProtectedRoute from "../ProtectedRoute";
import PublicRoute from "../PublicRoute";

const AppRoutes = () => {
	return (
		<Suspense
			fallback={
				<Spin spinning tip='Please wait...' fullscreen size='large'></Spin>
			}>
			<Routes>
				{routes?.map(
					(
						{ path, Layout, Page, isPublic, isAuthPage, isAdminPage, index },
						idx // Use array index as fallback
					) => {
						let RenderPage = isPublic ? (
							<Page />
						) : (
							<ProtectedRoute adminOnly={isAdminPage}>
								<Page />
							</ProtectedRoute>
						);

						if (isAuthPage) {
							RenderPage = <PublicRoute>{RenderPage}</PublicRoute>;
						}

						// Use path if defined, otherwise use index or array index
						const key = path || (index ? `index-${idx}` : `route-${idx}`);

						return (
							<Route
								key={key}
								path={path}
								index={index}
								element={Layout ? <Layout>{RenderPage}</Layout> : RenderPage}
							/>
						);
					}
				)}
			</Routes>
		</Suspense>
	);
};

export default React.memo(AppRoutes);
