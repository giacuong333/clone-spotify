import { useState } from "react";
import Sidebar from "../ChatSidebar/ChatSidebarInterface";
import ChatArea from "../ChatArea";
import { useChat } from "../../../contexts/Chat";

const ChatInterface = () => {
	const {
		error,
		messages,
		conversations,
		activeConversation,
		setActiveConversation,
	} = useChat;

	// Helper function to find active conversation
	const findActiveConversation = () => {
		return conversations.find((conv) => conv.id === activeConversation);
	};

	if (error) {
		return (
			<div className='bg-red-500 text-white p-2 text-center absolute bottom-0 left-0 right-0'>
				{error}
			</div>
		);
	}

	return (
		<div className='flex h-screen bg-[#121212] text-white'>
			<Sidebar
				conversations={conversations}
				activeConversation={activeConversation}
				onSelectConversation={setActiveConversation}
			/>
			<ChatArea
				activeConversation={activeConversation}
				messages={messages}
				findActiveConversation={findActiveConversation}
			/>
		</div>
	);
};

export default ChatInterface;
