const MessageItem = ({ message }) => {
	const isUser = message.sender === "user";

	return (
		<div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
			{!isUser && (
				<div className='w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-2'>
					<span className='font-bold text-xs'>S</span>
				</div>
			)}
			<div
				className={`max-w-xs p-3 rounded-lg ${
					isUser
						? "bg-green-500 text-white rounded-br-none"
						: "bg-gray-800 text-white rounded-bl-none"
				}`}>
				<p>{message.text}</p>
				<span className='text-xs text-gray-300 block text-right mt-1'>
					{message.time}
				</span>
			</div>
		</div>
	);
};

export default MessageItem;
