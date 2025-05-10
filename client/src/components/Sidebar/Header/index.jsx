import { BarsOutlined, PlusOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";

const Header = ({ onPopupModal }) => {
	return (
		<div className='flex items-center justify-between p-6'>
			<div className='flex items-center gap-2 cursor-pointer transition-all hover:text-white'>
				<BarsOutlined className='text-lg font-semibold !text-gray-200' />
				<p className='text-lg font-semibold text-gray-200'>Your Library</p>
			</div>
			<div>
				<Tooltip title='Create playlist'>
					<PlusOutlined
						className='text-lg font-semibold !text-gray-200 cursor-pointer transition-all hover:text-white hover:bg-gray-600 p-2 rounded-full'
						onClick={onPopupModal}
					/>
				</Tooltip>
			</div>
		</div>
	);
};

export default Header;
