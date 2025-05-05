import React from "react";

const ConversationItem = ({ conversation, isActive, onClick }) => {
	return (
		<div
			onClick={onClick}
			className={`p-3 flex items-center cursor-pointer hover:bg-gray-900 ${
				isActive ? "bg-gray-800" : ""
			}`}>
			<div className='w-10 h-10 rounded-full bg-green-500 flex items-center justify-center'>
				<span className='font-bold'>{conversation.avatar}</span>
			</div>
			<div className='ml-3 flex-1 overflow-hidden'>
				<div className='flex justify-between'>
					<h3 className='font-medium truncate'>{conversation.name}</h3>
					<span className='text-xs text-gray-400'>{conversation.time}</span>
				</div>
				<div className='flex items-center justify-between'>
					<p className='text-sm text-gray-400 truncate'>
						{conversation.lastMessage}
					</p>
					{conversation.unread > 0 && (
						<span className='bg-green-500 text-xs rounded-full w-5 h-5 flex items-center justify-center'>
							{conversation.unread}
						</span>
					)}
				</div>
			</div>
		</div>
	);
};

export default ConversationItem;
