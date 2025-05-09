import { Send, Paperclip, Mic, Smile } from "lucide-react";
import { useChat } from "../../../contexts/Chat";

const MessageInput = () => {
	const { inputMessage, setInputMessage, sendMessage, fetchConversations } =
		useChat();

	const handleSetInputMessage = (e) => {
		setInputMessage(e.target.value);
	};

	const handleKeyPress = async (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage(e);
			await fetchConversations();
		}
	};

	const handleSendClick = async (e) => {
		e.preventDefault();
		sendMessage(e);
		await fetchConversations();
	};

	return (
		<div className='p-4 border-t border-gray-800'>
			<div className='flex items-center bg-gray-800 rounded-full p-2 ps-4'>
				<button className='text-gray-400 mr-2'>
					<Paperclip size={20} className='cursor-pointer' />
				</button>
				<input
					type='text'
					value={inputMessage}
					onChange={handleSetInputMessage}
					onKeyDown={handleKeyPress}
					placeholder='Nhập tin nhắn...'
					className='flex-1 bg-transparent outline-none text-white'
				/>
				<button className='text-gray-400 mx-2'>
					<Smile size={20} className='cursor-pointer' />
				</button>
				<button className='text-gray-400 mr-2'>
					<Mic size={20} className='cursor-pointer' />
				</button>
				<button
					onClick={handleSendClick}
					className='bg-green-500 w-fit h-8 px-2 rounded-full flex items-center justify-center gap-2 cursor-pointer'>
					<Send size={16} />
					<p className='text-sm'>Send</p>
				</button>
			</div>
		</div>
	);
};

export default MessageInput;
