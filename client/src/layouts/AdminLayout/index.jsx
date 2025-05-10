import React, { useState } from "react";
// import { Navigate } from "react-router-dom";
import AdminSidebar from "../../components/AdminSidebar";
// import { useAuth } from "../../contexts/Auth";
// import paths from "../../constants/paths";
import { MenuOutlined } from "@ant-design/icons";
import Overlay from "../../components/Overlay";

const AdminLayout = ({ children }) => {
	// const { isAuthenticated, user } = useAuth();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	// if (!isAuthenticated() || (isAuthenticated() && user?.role === 2))
	//   return <Navigate to={paths.home} replace />;

	return (
		<div className='flex h-screen bg-gray-50 overflow-hidden'>
			{/* Desktop Sidebar */}
			<div className='hidden md:flex shadow-lg z-20'>
				<AdminSidebar />
			</div>

			{/* Mobile Sidebar - Overlay */}
			{mobileMenuOpen && (
				<Overlay
					toggle={mobileMenuOpen}
					setToggle={() => setMobileMenuOpen(false)}
				/>
			)}

			{/* Mobile Sidebar - Content */}
			<div
				className={`fixed top-0 left-0 h-full z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
					mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
				}`}>
				<AdminSidebar />
			</div>

			<div className='flex flex-col flex-1 overflow-hidden'>
				{/* Mobile Header with Menu Toggle */}
				<header className='md:hidden bg-white p-4 flex items-center shadow-sm'>
					<button
						onClick={() => setMobileMenuOpen(true)}
						className='text-gray-600 focus:outline-none'>
						<MenuOutlined className='text-xl' />
					</button>
					<div className='ml-4'>
						<h1 className='text-lg font-semibold text-gray-800'>
							Spotify Admin
						</h1>
					</div>
				</header>

				<main className='flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6'>
					<div className='mx-auto bg-white rounded-xl shadow-sm p-4 md:p-6'>
						{children}
					</div>
				</main>
			</div>
		</div>
	);
};

export default AdminLayout;
