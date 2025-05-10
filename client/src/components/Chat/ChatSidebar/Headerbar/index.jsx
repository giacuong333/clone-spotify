import { Menu } from "lucide-react";

const Headerbar = () => {
	return (
		<div className='px-4 py-4.5 border-b border-gray-800 flex justify-between items-center'>
			<h2 className='font-bold text-lg'>Chat</h2>
			<div className='flex items-center'>
				<button className='p-2 hover:bg-gray-800 rounded-full'>
					<Menu size={20} className='cursor-pointer' />
				</button>
			</div>
		</div>
	);
};

export default Headerbar;
