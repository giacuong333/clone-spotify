import React, { lazy, Suspense } from "react";
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
      <section className='bg-black p-2 pt-0 w-full min-h-screen max-h-screen overflow-hidden'>
        <div className=''>
          <Navbar />
          <div className='grid grid-cols-8 2xl:grid-cols-12 gap-2 w-full h-full'>
            <div className='col-span-2 2xl:col-span-2 w-full h-full'>
              <Sidebar />
            </div>
            <div className='col-span-6 2xl:col-span-10 w-full h-full'>
              <Content />
            </div>
          </div>
        </div>
      </section>
    </Suspense>
  );
};

export default Home;
