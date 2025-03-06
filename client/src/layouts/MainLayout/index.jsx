import { Spin } from "antd";
import React, { Suspense } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Footer from "../../components/Footer";

const MainLayout = ({ children }) => {
  return (
    <Suspense
      fallback={
        <Spin spinning tip='Please wait...' fullscreen size='large'></Spin>
      }>
      <section className='bg-black p-2 pt-0 w-full min-h-screen max-h-screen overflow-hidden'>
        <div className=''>
          <Navbar />
          <main className='grid grid-cols-8 2xl:grid-cols-12 gap-2 w-full h-full'>
            <div className='col-span-2 2xl:col-span-2 w-full h-full'>
              <Sidebar />
            </div>
            <div className='col-span-6 2xl:col-span-10 w-full h-full'>
              <div className='rounded-lg bg-[#121212] overflow-hidden h-full w-full relative min-h-screen max-h-screen overflow-y-scroll'>
                {children}
                <Footer />
              </div>
            </div>
          </main>
        </div>
      </section>
    </Suspense>
  );
};

export default MainLayout;
