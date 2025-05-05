import { useRef } from "react";
import ChatHeader from "../ChatHeader";
import MessageList from "../MessageList";
import MessageInput from "../MessageInput";

const ChatArea = ({
	activeConversation,
	messages,
	onSendMessage,
	findActiveConversation,
}) => {
	const messageEndRef = useRef(null);
	const conversation = findActiveConversation();

	return (
		<div className='w-2/3 flex flex-col border border-l-0 border-gray-800 rounded-tr-lg'>
			<ChatHeader conversation={conversation} />
			<MessageList messages={messages} messageEndRef={messageEndRef} />
			<MessageInput onSendMessage={onSendMessage} />
		</div>
	);
};

export default ChatArea;
