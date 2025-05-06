import React, { useMemo, useState } from "react";
import {
	HomeOutlined,
	SearchOutlined,
	DownloadOutlined,
	BellOutlined,
	ExportOutlined,
} from "@ant-design/icons";
import SpotifyLogo from "../../components/Icons/SpotifyLogo";
import { ConfigProvider, Form, Input, Popover } from "antd";
import { useNavigate } from "react-router-dom";
import paths from "../../constants/paths";
import _ from "lodash";
import { useAuth } from "../../contexts/Auth";
import SongUploadForm from "../SongUploadForm";

const Navbar = () => {
	const [form] = Form.useForm();
	const navigate = useNavigate();
	const [open, setOpen] = React.useState(false);
	const { isAuthenticated, user, logout } = useAuth();
	const [showSongUploadForm, setShowSongUploadForm] = useState(false);

	const popoverItems = useMemo(() => {
		return [
			{ id: 2, content: "Profile", action: () => navigate(paths.profile) },
			{
				id: 2.5,
				content: "My Statistics",
				action: () => navigate(paths.myStats),
			},
			{
				id: 3,
				content: "Upgrade to Premium",
				Icon: ExportOutlined,
			},
			{
				id: 4,
				content: "Support",
				Icon: ExportOutlined,
			},
			{
				id: 5,
				content: "Download",
				Icon: ExportOutlined,
			},
			{ id: 6, content: "Settings" },
			{ id: 7, content: "Logout", action: (callback) => callback() },
		];
	}, []);

	const hide = () => {
		setOpen(false);
	};

	const handleOpenChange = (newOpen) => {
		setOpen(newOpen);
	};

	const handleSearch = (values) => {
		setSearchQuery(values["search"]);
		navigate(_.isEmpty(values) ? paths.home : paths.search);
	};

	return (
		<ConfigProvider
			theme={{
				components: {
					Form: {
						red: false,
						labelColor: "white",
						labelFontSize: 14,
					},
					Input: {
						colorBgContainer: "#242424",
						colorText: "#bbb",
						colorBorder: "transparent",
						borderRadius: 8,
						colorTextPlaceholder: "#a0a0a0",
						hoverBg: "#2A2A2A",
						activeBorderColor: "#1DB954",
						height: 48,
					},
				},
			}}>
			<>
				<nav className='w-full h-16 bg-black py-2 px-4'>
					<div className='flex items-center justify-between w-full h-full'>
						{/* Left Section */}
						<div className='flex items-center space-x-6 h-full'>
							<div
								className='px-2 cursor-pointer'
								onClick={() => navigate(paths.home)}>
								<SpotifyLogo height={32} fillColor='white' />
							</div>
							<div className='flex items-center space-x-4 h-full'>
								<HomeOutlined
									style={{ color: "white" }}
									className='cursor-pointer text-2xl bg-neutral-700 rounded-full p-2.5 hover:bg-neutral-600 transition-all'
									onClick={() => navigate(paths.home)}
								/>

								{/* Search */}
								<Form
									form={form}
									onFinish={handleSearch}
									autoComplete='on'
									layout='vertical'
									className='w-full !h-full'>
									<Form.Item
										name='search'
										tooltip='This is a required field'
										rules={[{ required: false }]}
										className='!mb-0 !w-full !h-full !flex !items-center' // Loại bỏ margin mặc định
									>
										<Input
											prefix={
												<SearchOutlined className='text-gray-400 text-2xl' />
											}
											placeholder='What do you want to play?'
											className='md:!w-full xl:!w-md !py-2.5 !px-4 !h-full !border-neutral-800 !border-2 focus-within:!border-white hover:!border-gray-300 !rounded-full transition-all !text-gray-200 !text-lg'
											style={{
												backgroundColor: "#242424",
												color: "#bbb",
											}}
										/>
									</Form.Item>
								</Form>
							</div>
						</div>

						{/* Right Section */}
						<div className='flex items-center space-x-6 h-full'>
							{!isAuthenticated ? (
								<>
									<div className='flex items-center gap-4 text-white text-sm'>
										<p className='cursor-pointer text-gray-400 font-bold hover:text-white hover:scale-[1.05] transition-all'>
											Premium
										</p>
										<p className='cursor-pointer text-gray-400 font-bold hover:text-white hover:scale-[1.05] transition-all'>
											Support
										</p>
										<p className='flex items-center gap-2 cursor-pointer text-gray-400 font-bold hover:text-white hover:scale-[1.05] transition-all'>
											<DownloadOutlined />
											<span>Download</span>
										</p>
									</div>
									<div className='w-[1px] h-7 bg-white mr-8'></div>
									<p
										className='cursor-pointer text-gray-400 font-bold hover:text-white hover:scale-[1.05] transition-all'
										onClick={() => navigate(paths.register)}>
										Sign up
									</p>
									<p
										className='text-center flex items-center bg-white h-full px-8 rounded-full cursor-pointer text-black font-bold hover:bg-gray-200 hover:scale-[1.05] transition-all'
										onClick={() => navigate(paths.login)}>
										Log in
									</p>
								</>
							) : (
								<>
									<div className='flex items-center gap-4 text-white text-sm'>
										<p
											className='capitalize cursor-pointer text-gray-400 font-bold hover:text-white hover:scale-[1.05] transition-all'
											onClick={() => navigate(paths.chats)}>
											Chat
										</p>
									</div>
									<div className='flex items-center gap-4 text-white text-sm'>
										<p
											className='capitalize cursor-pointer text-gray-400 font-bold hover:text-white hover:scale-[1.05] transition-all'
											onClick={() => setShowSongUploadForm(true)}>
											Upload Song
										</p>
									</div>
									<div className='w-[1px] h-7 bg-white mr-8'></div>
									<BellOutlined className='!text-white/70 text-xl cursor-pointer hover:!text-white' />
									<Popover
										content={
											<ul>
												{popoverItems?.map((item) => {
													return (
														<li key={item?.id} className='group'>
															<div
																className='flex items-center justify-between gap-6 px-3 py-2.5 cursor-pointer group-hover:!bg-white/20'
																onClick={() => {
																	if (
																		item.action &&
																		typeof item.action === "function"
																	) {
																		if (item.content === "Logout") {
																			item.action(logout);
																		} else {
																			item.action();
																		}
																	}
																}}>
																<p className='group-hover:underline text-white'>
																	{item?.content}
																</p>
																{item?.Icon && (
																	<item.Icon className='!text-white' />
																)}
															</div>
														</li>
													);
												})}
											</ul>
										}
										trigger='click'
										arrow={false}
										open={open}
										color='black'
										onOpenChange={handleOpenChange}>
										<div className='flex items-center justify-center p-2 rounded-full bg-[#1F1F1F] cursor-pointer group'>
											<p className='capitalize text-black font-bold bg-[#F573A0] w-8 h-8 flex items-center justify-center rounded-full group-hover:scale-[1.04]'>
												{user?.name[0]}
											</p>
										</div>
									</Popover>
								</>
							)}
							{/* <div className='flex items-center gap-6 text-white text-sm h-full'>
								<span className='flex items-center gap-2 cursor-pointer text-gray-400 font-bold hover:text-white hover:scale-[1.05] transition-all'>
									<DownloadOutlined />
									<p>Install App</p>
								</span>
								{isAuthenticated ? (
									<>
										<BellOutlined className='!text-white/70 text-xl cursor-pointer hover:!text-white' />
										<Popover
											content={
												<ul>
													{popoverItems?.map((item) => {
														return (
															<li key={item?.id} className='group'>
																<div
																	className='flex items-center justify-between gap-6 px-3 py-2.5 cursor-pointer group-hover:!bg-white/20'
																	onClick={() =>
																		item?.action && item?.action(logout)
																	}>
																	<p className='group-hover:underline text-white'>
																		{item?.content}
																	</p>
																	{item?.Icon && (
																		<item.Icon className='!text-white' />
																	)}
																</div>
															</li>
														);
													})}
												</ul>
											}
											trigger='click'
											arrow={false}
											open={open}
											color='black'
											onOpenChange={handleOpenChange}>
											<div className='flex items-center justify-center p-2 rounded-full bg-[#1F1F1F] cursor-pointer group'>
												<p className='capitalize text-black font-bold bg-[#F573A0] w-8 h-8 flex items-center justify-center rounded-full group-hover:scale-[1.04]'>
													{user?.name[0]}
												</p>
											</div>
										</Popover>
									</>
								) : (
									<>
										
									</>
								)}
							</div> */}
						</div>
					</div>
				</nav>
				<SongUploadForm
					show={showSongUploadForm}
					onShow={setShowSongUploadForm}
				/>
			</>
		</ConfigProvider>
	);
};

export default React.memo(Navbar);
