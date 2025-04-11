import React from "react";
import { BarsOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Col, Row } from "antd";

const items = [
	{
		id: 1,
		title: "Create your first playlist",
		subtitle: "It's easy, we'll help you",
		buttonText: "Create playlist",
	},
	{
		id: 2,
		title: "Let's find some padcasts to follow",
		subtitle: "We'll keep you updated on new episodes",
		buttonText: "Browse podcasts",
	},
];

const Sidebar = () => {
	return (
		<div className='flex flex-col bg-[#121212] rounded-lg w-full min-h-screen max-h-screenz overflow-hidden'>
			<div>
				{/* Top */}
				<div className='flex items-center justify-between p-6'>
					<div className='flex items-center gap-2 cursor-pointer transition-all hover:text-white'>
						<BarsOutlined className='text-lg font-semibold !text-gray-200' />
						<p className='text-lg font-semibold text-gray-200'>Your Library</p>
					</div>
					<div>
						<PlusOutlined className='text-lg font-semibold !text-gray-200 cursor-pointer transition-all hover:text-white hover:bg-gray-600 p-2 rounded-full' />
					</div>
				</div>

				{/* Middle */}
				<div className='p-2 max-h-96 h-full overflow-y-scroll'>
					{items.map((item) => {
						return (
							<div key={item?.id} className='bg-[#1f1f1f] mb-6 rounded-lg'>
								<div className='p-6'>
									<p className='text-white font-bold mb-1'>{item?.title}</p>
									<p className='text-gray-400 text-sm'>{item?.subtitle}</p>
									<Button className='mt-6 !font-bold !rounded-full hover:!bg-gray-200 hover:!text-black !border-none hover:scale-[1.05]'>
										{item?.buttonText}
									</Button>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			{/* Bottom */}
			<div className='p-6 grow flex items-end'>
				<div className='mb-30'>
					<Row gutter={30} className='mb-4'>
						<Col>
							<p className='text-gray-400 text-xs cursor-pointer'>Legal</p>
						</Col>
						<Col>
							<p className='text-gray-400 text-xs cursor-pointer'>
								Safety & Privacy Center
							</p>
						</Col>
						<Col>
							<p className='text-gray-400 text-xs cursor-pointer'>
								Privacy Policy
							</p>
						</Col>
					</Row>
					<Row gutter={30} className='mb-4'>
						<Col>
							<p className='text-gray-400 text-xs cursor-pointer'>About Ads</p>
						</Col>
						<Col>
							<p className='text-gray-400 text-xs cursor-pointer'>
								Accessibility
							</p>
						</Col>
					</Row>
					<Row gutter={30} className=''>
						<Col>
							<p className='text-xs cursor-pointer text-white'>Cookies</p>
						</Col>
					</Row>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
