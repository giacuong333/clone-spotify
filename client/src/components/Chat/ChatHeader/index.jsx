import { Phone, Video, MoreVertical } from "lucide-react";
import { useUser } from "../../../contexts/User";
import { useChat } from "../../../contexts/Chat";
import { useMemo } from "react";

const ChatHeader = () => {
	const { activeConversation } = useChat();
	const { user, searchUserResult } = useUser();

	// Get the active conversation's name for the header
	const activeChatName = useMemo(() => {
		// First check if it's a search result
		const searchUser = searchUserResult.find(
			(u) => u.id === activeConversation
		);
		if (searchUser) {
			return searchUser.name || searchUser.username;
		}

		console.log("searchUser", searchUser);

		// Then check existing conversations
		const conversation = user?.conversations?.find(
			(c) => c.id === activeConversation
		);
		if (conversation) {
			return conversation.name;
		}

		return "Chat";
	}, [activeConversation, searchUserResult, user]);

	console.log("activeChatName", activeChatName);

	return (
		<div className='px-4 py-4.5 border-b border-gray-800 flex justify-between items-center'>
			<div className='flex items-center'>
				<div className='w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-3'>
					<p className='font-bold'>{activeChatName.charAt(0).toUpperCase()}</p>
				</div>
				<h3 className='font-medium'>{activeChatName}</h3>
			</div>

			<div className='flex items-center space-x-3'>
				<button className='p-2 hover:bg-gray-800 rounded-full'>
					<Phone size={18} className='cursor-pointer' />
				</button>
				<button className='p-2 hover:bg-gray-800 rounded-full'>
					<Video size={18} className='cursor-pointer' />
				</button>
				<button className='p-2 hover:bg-gray-800 rounded-full'>
					<MoreVertical size={18} className='cursor-pointer' />
				</button>
			</div>
		</div>
	);
};

export default ChatHeader;
