import React, { lazy, Suspense } from "react";
import { useLocation } from "react-router-dom";
import paths from "../../constants/paths";
import { Spin } from "antd";

const Navbar = lazy(() => import("../../components/Navbar"));
const Sidebar = lazy(() => import("../../components/Sidebar"));
const Content = lazy(() => import("../../components/Content"));

const Home = () => {
  return (
    <Suspense
      fallback={
        <Spin spinning tip='Please wait...' fullscreen size='large'></Spin>
      }>
      <section className={`bg-black w-full max-h-full h-screen px-2`}>
        <Navbar />
        <div className='flex items-start gap-2 w-full h-full'>
          <div className='lg:flex-4/12 flex-5/12 w-full h-full'>
            <Sidebar />
          </div>
          <div className='lg:flex-8/12 flex-7/12 w-full h-full'>
            <Content />
          </div>
        </div>
      </section>
    </Suspense>
  );
};

export default Home;
