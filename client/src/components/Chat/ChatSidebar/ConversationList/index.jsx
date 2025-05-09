import { useAuth } from "../../../../contexts/Auth";
import { useChat } from "../../../../contexts/Chat";
import { useUser } from "../../../../contexts/User";
import ConversationItem from "../ConversationItem";
import { useEffect, useMemo } from "react";

const ConversationList = () => {
	const {
		conversations,
		loadingConversations,
		activeConversation,
		setActiveConversation,
		fetchConversations,
		searchUserInput,
		fetchMessages,
	} = useChat();
	const { searchUserResult, loadingSearchUserResult } = useUser();
	const { user } = useAuth();

	// When component mounts, render existing conversations
	useEffect(() => {
		fetchConversations();
	}, [fetchConversations]);

	// If user finds other users, display found users, otherwise render existing conversations
	const displayItems = useMemo(() => {
		if (searchUserInput.trim() !== "") {
			return searchUserResult || [];
		} else {
			return conversations || [];
		}
	}, [searchUserInput, searchUserResult, conversations]);

	const handleItemClick = (otherUserId) => {
		setActiveConversation(otherUserId);
	};

	if (
		(loadingConversations && !searchUserInput) ||
		(loadingSearchUserResult && searchUserInput)
	) {
		return (
			<div className='flex-1 flex items-center justify-center'>
				<div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-700'></div>
			</div>
		);
	}

	console.log("Conversation List: ", displayItems);

	return (
		<div className='overflow-y-auto flex-1'>
			{displayItems.map((conversation) => (
				<ConversationItem
					key={conversation.id}
					conversation={conversation}
					isActive={conversation.id === activeConversation}
					onClick={() => handleItemClick(conversation.id)}
				/>
			))}
		</div>
	);
};

export default ConversationList;
