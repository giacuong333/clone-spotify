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
          ({
            path,
            Layout,
            Page,
            isPublic,
            isAuthPage,
            isAdminPage,
            index,
          }) => {
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

            return (
              <Route
                key={path}
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
