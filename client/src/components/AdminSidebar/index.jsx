import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
	CloseOutlined,
	MenuOutlined,
	LogoutOutlined,
	HomeOutlined,
	PlayCircleOutlined,
	UserOutlined,
	SettingOutlined,
	BarChartOutlined,
	LeftOutlined,
	RightOutlined,
	TagsOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../contexts/Auth";
import paths from "../../constants/paths";

// Updated sidebar items with icons
const items = [
	{ name: "Dashboard", path: paths.admin, icon: <HomeOutlined /> },
	{
		name: "Song Management",
		path: paths.songs,
		icon: <PlayCircleOutlined />,
	},
	{ name: "User Management", path: paths.users, icon: <UserOutlined /> },
	{ name: "Genre Management", path: paths.genres, icon: <TagsOutlined /> },
	{ name: "Analytics", path: paths.statistics, icon: <BarChartOutlined /> },
	{ name: "Settings", path: paths.settings, icon: <SettingOutlined /> },
];

const AdminSidebar = () => {
	const navigate = useNavigate();
	const [showItems, setShowItems] = useState(true);
	const [collapsed, setCollapsed] = useState(false);
	const location = useLocation();
	const { logout } = useAuth();

	// Handle window resize to auto-expand on larger screens
	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth > 1024) {
				setCollapsed(false);
			}
		};

		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handleLogout = async () => {
		await logout();
	};

	return (
		<div
			className={`flex flex-col h-full bg-gradient-to-b from-green-950 to-black text-white transition-all duration-300 ${
				collapsed ? "w-16" : "w-full"
			}`}>
			{/* Header with Logo */}
			<div className='flex items-center justify-between border-b border-indigo-700'>
				{!collapsed ? (
					<div className='flex items-center justify-between w-full px-6 py-5'>
						<div className='flex items-center space-x-2'>
							<span className='text-2xl font-bold tracking-wider'>Spotify</span>
							<span className='text-xs bg-purple-500 px-2 py-0.5 rounded capitalize'>
								Admin
							</span>
						</div>
						<div
							className='hidden md:flex cursor-pointer p-2 rounded-md hover:bg-indigo-700'
							onClick={() => setCollapsed(true)}>
							<LeftOutlined className='text-white' />
						</div>
					</div>
				) : (
					<div className='flex items-center justify-center w-full py-5'>
						<div
							className='cursor-pointer p-2 rounded-md hover:bg-indigo-700'
							onClick={() => setCollapsed(false)}>
							<RightOutlined className='text-white' />
						</div>
					</div>
				)}
			</div>

			{/* Mobile Toggle */}
			{!collapsed && (
				<div
					className='md:hidden flex w-fit justify-end cursor-pointer p-2 mx-2 my-2 rounded-md hover:bg-indigo-700'
					onClick={() => setShowItems(!showItems)}>
					{showItems ? (
						<CloseOutlined className='text-white' />
					) : (
						<MenuOutlined className='text-white' />
					)}
				</div>
			)}

			{/* Navigation Items */}
			{(showItems || collapsed) && (
				<div className='flex-1 overflow-y-auto py-4'>
					<ul className={`space-y-1 ${collapsed ? "px-1" : "px-3"}`}>
						{items?.map((item, index) => (
							<li key={index}>
								<button
									className={`flex items-center w-full ${
										collapsed ? "justify-center" : "text-left"
									} ${
										collapsed ? "px-2 py-3" : "px-4 py-3"
									} rounded-lg transition-all duration-150 ${
										location.pathname === item.path
											? "bg-indigo-700 text-white shadow-md"
											: "text-indigo-200 hover:bg-indigo-700/50 hover:text-white"
									}`}
									onClick={() => navigate(item?.path)}
									title={collapsed ? item.name : ""}>
									<span className={collapsed ? "" : "mr-3"}>{item.icon}</span>
									{!collapsed && (
										<span className='text-sm font-medium'>{item?.name}</span>
									)}
								</button>
							</li>
						))}
					</ul>
				</div>
			)}

			{/* Logout Button */}
			<div
				className={`border-t border-indigo-700 ${collapsed ? "p-2" : "p-4"}`}>
				<button
					className={`flex items-center ${
						collapsed
							? "w-full justify-center px-2 py-3"
							: "w-full text-left px-4 py-3"
					} rounded-lg text-indigo-200 hover:bg-indigo-700/50 hover:text-white transition-colors duration-150`}
					onClick={handleLogout}
					title={collapsed ? "Sign out" : ""}>
					<LogoutOutlined className={collapsed ? "" : "mr-3"} />
					{!collapsed && <span className='text-sm font-medium'>Sign out</span>}
				</button>
			</div>
		</div>
	);
};

export default AdminSidebar;
