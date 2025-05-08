import MessageItem from "../MessageItem";
import { useChat } from "../../../contexts/Chat";

const MessageList = () => {
	const { messages, messageEndRef, loadingMessages } = useChat();

	if (loadingMessages) {
		return (
			<div className='flex-1 flex items-center justify-center'>
				<div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500'></div>
			</div>
		);
	}

	return (
		<div className='flex-1 overflow-y-auto p-4 space-y-4'>
			{messages.length === 0 ? (
				<div className='flex-1 flex items-center justify-center text-gray-400'>
					No messages yet. Start a conversation!
				</div>
			) : (
				messages.map((message) => (
					<MessageItem key={message.id} message={message} />
				))
			)}
			<div ref={messageEndRef} />
		</div>
	);
};

export default MessageList;
