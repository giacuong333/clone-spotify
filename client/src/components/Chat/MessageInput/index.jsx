import { useState } from "react";
import { Send, Paperclip, Mic, Smile } from "lucide-react";

const MessageInput = ({ onSendMessage }) => {
	const [input, setInput] = useState("");

	const handleSend = () => {
		if (input.trim() === "") return;
		onSendMessage(input);
		setInput("");
	};

	return (
		<div className='p-4 border-t border-gray-800'>
			<div className='flex items-center bg-gray-800 rounded-full px-4 py-2'>
				<button className='text-gray-400 mr-2'>
					<Paperclip size={20} />
				</button>
				<input
					type='text'
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyPress={(e) => e.key === "Enter" && handleSend()}
					placeholder='Nhập tin nhắn...'
					className='flex-1 bg-transparent outline-none text-white'
				/>
				<button className='text-gray-400 mx-2'>
					<Smile size={20} />
				</button>
				<button className='text-gray-400 mr-2'>
					<Mic size={20} />
				</button>
				<button
					onClick={handleSend}
					className='bg-green-500 w-8 h-8 rounded-full flex items-center justify-center'>
					<Send size={16} />
				</button>
			</div>
		</div>
	);
};

export default MessageInput;
