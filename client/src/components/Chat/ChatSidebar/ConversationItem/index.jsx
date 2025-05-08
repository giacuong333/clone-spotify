import { useMemo } from "react";

const ConversationItem = ({ conversation, isActive, onClick }) => {
	const avatar = useMemo(() => {
		if (!conversation?.image) {
			return (conversation?.name || conversation?.username || "?").charAt(0);
		} else {
			return conversation?.image;
		}
	}, [conversation]);

	// Determine if this is a search result or conversation
	const isSearchResult = !conversation?.lastMessage && !conversation?.time;

	return (
		<div
			onClick={onClick}
			className={`p-3 flex items-center cursor-pointer hover:bg-gray-900 ${
				isActive ? "bg-gray-800" : ""
			}`}>
			<div className='w-10 h-10 rounded-full bg-green-600 flex items-center justify-center'>
				<span className='font-bold uppercase'>{avatar}</span>
			</div>
			<div className='ml-3 flex-1 overflow-hidden'>
				<div className='flex justify-between'>
					<h3 className='font-medium truncate'>
						{conversation.name || conversation.username || "Unknown"}
					</h3>
					{!isSearchResult && (
						<span className='text-xs text-gray-400'>{conversation.time}</span>
					)}
				</div>
				<div className='flex items-center justify-between'>
					<p className='text-sm text-gray-400 truncate'>
						{isSearchResult
							? "Start a new conversation"
							: conversation.lastMessage || "No messages yet"}
					</p>
					{!isSearchResult && conversation.unread > 0 && (
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
