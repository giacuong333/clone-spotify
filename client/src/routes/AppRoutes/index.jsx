import React, { Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import routes from "../routes";
import { Spin } from "antd";

const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <Spin spinning tip='Please wait...' fullscreen size='large'></Spin>
      }>
      <Routes>
        {routes.map(({ path, Page, isPublic, index }) => {
          return (
            <Route key={path} path={path} index={index} element={<Page />} />
          );
        })}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
