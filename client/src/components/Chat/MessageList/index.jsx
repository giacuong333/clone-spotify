import MessageItem from "../MessageItem";

const MessageList = ({ messages, messageEndRef }) => {
	return (
		<div className='flex-1 overflow-y-auto p-4 space-y-4'>
			{messages.map((message) => (
				<MessageItem key={message.id} message={message} />
			))}
			<div ref={messageEndRef} />
		</div>
	);
};

export default MessageList;
