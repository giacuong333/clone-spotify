import { useRef } from "react";
import ChatHeader from "../ChatHeader";
import MessageList from "../MessageList";
import MessageInput from "../MessageInput";
import { MessageSquare } from "lucide-react";
import { useChat } from "../../../contexts/Chat";

const ChatArea = () => {
	const messageEndRef = useRef(null);
	const { activeConversation, messages } = useChat();

	return (
		<div className='w-2/3 flex flex-col border border-l-0 border-gray-800 rounded-tr-lg'>
			<ChatHeader conversation={activeConversation} />
			{activeConversation ? (
				<>
					<MessageList messages={messages} messageEndRef={messageEndRef} />
					<MessageInput />
				</>
			) : (
				<div className='flex-1 flex items-center justify-center flex-col p-4 text-gray-400'>
					<MessageSquare size={48} />
					<p className='mt-4'>
						Select a conversation or search for a user to start chatting
					</p>
				</div>
			)}
		</div>
	);
};

export default ChatArea;
