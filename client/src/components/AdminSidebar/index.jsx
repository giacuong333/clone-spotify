import React, { useState } from "react";
import items from "./items";
import { useLocation, useNavigate } from "react-router-dom";
import { CloseOutlined, MenuOutlined, LogoutOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/Auth";

const AdminSidebar = () => {
	const navigate = useNavigate();
	const [showItems, setShowItems] = useState(true);
	const location = useLocation();
	const { logout } = useAuth();

	const handleLogout = async () => {
		await logout();
	};

	return (
		<section
			className={`bg-black flex flex-col transition-all duration-500 h-screen ${
				showItems ? "max-h-full" : "max-h-fit"
			}`}>
			<div className='flex-grow'>
				<div className='text-3xl font-semibold mb-4 text-white flex items-center justify-between'>
					<div>
						<p className='p-4 xl:text-5xl lg:text-4xl text-3xl font-serif tracking-widest truncate'>
							Spotify
						</p>
					</div>
					<div
						className='md:hidden block cursor-pointer p-1 px-2 rounded-md hover:bg-slate-500'
						onClick={() => setShowItems(!showItems)}>
						{showItems ? (
							<CloseOutlined className='text-white text-md' />
						) : (
							<MenuOutlined className='text-white text-md' />
						)}
					</div>
				</div>

				{showItems && (
					<ul>
						{items?.map((item, index) => {
							return (
								<li
									key={index}
									className={`cursor-pointer hover:bg-white/20 hover:text-white rounded-sm py-2 px-3 my-0.5 mx-4 ${
										location.pathname === item.path
											? "bg-white/40 text-white"
											: "text-white/60"
									}`}
									onClick={() => navigate(item?.path)}>
									{item?.name}
								</li>
							);
						})}
					</ul>
				)}
			</div>

			<div className='bg-white p-2 cursor-pointer mb-10 flex items-center justify-center gap-4'>
				<LogoutOutlined size={20} className='text-black' />
				<p className='text-center text-black' onClick={handleLogout}>
					Sign out
				</p>
			</div>
		</section>
	);
};

export default AdminSidebar;
