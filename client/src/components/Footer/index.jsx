import React from "react";
import {
	InstagramOutlined,
	TwitterOutlined,
	FacebookFilled,
} from "@ant-design/icons";

const footerItemList = [
	{
		title: "Company",
		items: [{ name: "About" }, { name: "Jobs" }, { name: "For the Record" }],
	},
	{
		title: "Communities",
		items: [
			{ name: "For Artists" },
			{ name: "Developers" },
			{ name: "Advertising" },
			{ name: "Investors" },
			{ name: "Vendors" },
		],
	},
	{
		title: "Useful links",
		items: [{ name: "Support" }, { name: "Free Mobile App" }],
	},
	{
		title: "Spotify Plans",
		items: [
			{ name: "Premium Individual" },
			{ name: "Premium Student" },
			{ name: "Spotify Free" },
		],
	},
];

const Footer = () => {
	return (
		<footer className='py-14 2xl:max-w-10/12 w-full mx-auto 2xl:px-0 px-14'>
			<div>
				<div className='flex flex-wrap items-start xl:justify-between sm:justify-start justify-center gap-16'>
					{footerItemList.map((item, index) => {
						return (
							<div key={index}>
								<p className='text-lg font-bold text-white'>{item?.title}</p>
								<ul className='flex flex-col gap-3 mt-3'>
									{item?.items?.map((childItem, index) => {
										return (
											<li
												key={index}
												className='text-white/50 hover:text-white hover:underline cursor-pointer'>
												{childItem?.name}
											</li>
										);
									})}
								</ul>
							</div>
						);
					})}
					<div className='flex items-start gap-3'>
						<InstagramOutlined className='!text-white bg-neutral-700 hover:bg-neutral-500 p-2.5 text-xl rounded-full' />
						<TwitterOutlined className='!text-white bg-neutral-700 hover:bg-neutral-500 p-2.5 text-xl rounded-full' />
						<FacebookFilled className='!text-white bg-neutral-700 hover:bg-neutral-500 p-2.5 text-xl rounded-full' />
					</div>
				</div>
			</div>
			<div className='py-14 pb-16 mt-14 border-t border-neutral-700'>
				<p className='text-white/50 text-start'>© 2025 Spotify AB</p>
			</div>
		</footer>
	);
};

export default Footer;
