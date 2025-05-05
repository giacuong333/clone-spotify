import { Search } from "lucide-react";

const Searchbar = () => {
	return (
		<div className='p-3'>
			<div className='flex items-center bg-gray-800 rounded-full px-3 py-2'>
				<Search size={16} className='text-gray-400' />
				<input
					type='text'
					placeholder='Search'
					className='ml-2 bg-transparent outline-none text-sm flex-1'
				/>
			</div>
		</div>
	);
};

export default Searchbar;
