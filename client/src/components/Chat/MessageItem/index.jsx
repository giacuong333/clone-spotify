import { useCallback, useMemo } from "react";
import { useAuth } from "../../../contexts/Auth";
import { useChat } from "../../../contexts/Chat";

const MessageItem = ({ message }) => {
	const { user } = useAuth();
	const { messageEndRef, conversations } = useChat();

	const isCurrentUser = useMemo(() => {
		return message.sender.id === user?.id;
	}, [message.sender.id, user?.id]);

	const senderName = conversations.find(
		(con) => con.id === message?.sender?.id
	)?.name;

	// Get the first letter of the sender's name for the avatar
	const senderAvatar = useMemo(() => {
		if (isCurrentUser) {
			return user?.name?.charAt(0) || "?";
		} else {
			return message.sender?.name?.charAt(0) || senderName?.charAt(0) || "?";
		}
	}, [isCurrentUser, message, user?.name]);

	return (
		<>
			<div
				className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
				{!isCurrentUser && (
					<div className='w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mr-2'>
						<span className='font-bold text-xs'>{senderAvatar}</span>
					</div>
				)}
				<div
					className={`max-w-xs p-3 rounded-lg ${
						isCurrentUser
							? "bg-green-500 text-white rounded-br-none"
							: "bg-gray-800 text-white rounded-bl-none"
					}`}>
					<p
						className={`${
							isCurrentUser
								? "text-black rounded-bl-none"
								: "text-white rounded-br-none"
						}`}>
						{message.text}
					</p>
					<span
						className={`text-xs block text-right mt-1 ${
							isCurrentUser ? "text-black" : "text-gray-300"
						}`}>
						{message.time ||
							new Date(message.timestamp).toLocaleTimeString([], {
								hour: "2-digit",
								minute: "2-digit",
							})}
					</span>
				</div>
				{isCurrentUser && (
					<div className='w-8 h-8 rounded-full bg-green-500 flex items-center justify-center ml-2'>
						<span className='font-bold text-xs text-black'>{senderAvatar}</span>
					</div>
				)}
			</div>
			<div ref={messageEndRef} />
		</>
	);
};

export default MessageItem;
