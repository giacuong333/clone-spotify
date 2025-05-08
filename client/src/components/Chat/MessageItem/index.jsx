import { useMemo } from "react";
import { useUser } from "../../../contexts/User";

const MessageItem = ({ message }) => {
	const { user } = useUser();
	const isCurrentUser = message.sender === user?.id;

	// Get the first letter of the sender's name for the avatar
	const senderAvatar = useMemo(() => {
		if (isCurrentUser) {
			return user?.username?.charAt(0) || "?";
		} else {
			return message.senderName?.charAt(0) || "?";
		}
	}, [isCurrentUser, message.senderName, user?.username]);

	return (
		<div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
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
				<p>{message.text}</p>
				<span className='text-xs text-gray-300 block text-right mt-1'>
					{message.time ||
						new Date(message.timestamp).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						})}
				</span>
			</div>
			{isCurrentUser && (
				<div className='w-8 h-8 rounded-full bg-green-500 flex items-center justify-center ml-2'>
					<span className='font-bold text-xs'>{senderAvatar}</span>
				</div>
			)}
		</div>
	);
};

export default MessageItem;
