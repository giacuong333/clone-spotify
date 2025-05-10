import { Spin } from "antd";
import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import paths from "../../constants/paths";

const Navbar = React.lazy(() => import("../../components/Navbar"));
const Sidebar = React.lazy(() => import("../../components/Sidebar"));
const Footer = React.lazy(() => import("../../components/Footer"));
const NowPlayingBar = React.lazy(() =>
	import("../../components/NowPlayingBar")
);
const Videobar = React.lazy(() => import("../../components/Videobar"));

const MainLayout = ({ children }) => {
	const currentPath = useLocation().pathname;

	const isChatPath = useMemo(() => {
		return currentPath === paths.chats;
	}, [currentPath]);

	return (
		<React.Suspense
			fallback={
				<Spin spinning tip='Please wait...' fullscreen size='large'></Spin>
			}>
			<section className='bg-black p-2 pb-0 pt-0 w-full'>
				<div className=''>
					<Navbar />
					<main className='grid grid-cols-12 gap-2 w-full h-full'>
						<div className='col-span-3 w-full h-full'>
							<Sidebar />
						</div>
						<div
							className={`${
								!isChatPath ? "col-span-6" : "col-span-9"
							} w-full h-full`}>
							<div className='rounded-lg bg-[#121212] overflow-hidden h-full w-full relative min-h-screen max-h-screen overflow-y-scroll'>
								{children}
								<Footer />
							</div>
						</div>
						{!isChatPath && (
							<div className='col-span-3 w-full h-full'>
								<Videobar />
							</div>
						)}
					</main>
				</div>
				<div className='w-full sticky bottom-0'>
					<NowPlayingBar />
				</div>
			</section>
		</React.Suspense>
	);
};

export default MainLayout;
