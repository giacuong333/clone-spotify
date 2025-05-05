import { Phone, Video, MoreVertical } from "lucide-react";

const ChatHeader = ({ conversation }) => {
	return (
		<div className='p-4 border-b border-gray-800 flex justify-between items-center'>
			<div className='flex items-center'>
				<div className='w-10 h-10 rounded-full bg-green-500 flex items-center justify-center'>
					<span className='font-bold'>{conversation?.avatar || "S"}</span>
				</div>
				<div className='ml-3'>
					<h3 className='font-semibold'>
						{conversation?.name || "Spotify Support"}
					</h3>
					<p className='text-xs text-gray-400'>Online</p>
				</div>
			</div>
			<div className='flex items-center space-x-3'>
				<button className='p-2 hover:bg-gray-800 rounded-full'>
					<Phone size={18} />
				</button>
				<button className='p-2 hover:bg-gray-800 rounded-full'>
					<Video size={18} />
				</button>
				<button className='p-2 hover:bg-gray-800 rounded-full'>
					<MoreVertical size={18} />
				</button>
			</div>
		</div>
	);
};

export default ChatHeader;
