import { useEffect, useState } from "react";
import Sidebar from "../ChatSidebar/ChatSidebarInterface";
import ChatArea from "../ChatArea";

const ChatInterface = () => {
	const [conversations, setConversations] = useState([
		{
			id: 1,
			name: "Spotify Support",
			avatar: "S",
			unread: 0,
			lastMessage: "Chúng tôi cung cấp nhiều dịch vụ khác nhau...",
			time: "10:32 AM",
			active: true,
		},
		{
			id: 2,
			name: "Nhóm Âm nhạc",
			avatar: "N",
			unread: 3,
			lastMessage: "Hãy chia sẻ những bài hát mới",
			time: "09:45 AM",
			active: false,
		},
		{
			id: 3,
			name: "DJ Hoàng",
			avatar: "H",
			unread: 0,
			lastMessage: "Playlist đã được cập nhật",
			time: "Hôm qua",
			active: false,
		},
		{
			id: 4,
			name: "Hỗ trợ kỹ thuật",
			avatar: "H",
			unread: 0,
			lastMessage: "Vấn đề đã được giải quyết",
			time: "Thứ 2",
			active: false,
		},
		{
			id: 5,
			name: "Phòng nhạc",
			avatar: "P",
			unread: 0,
			lastMessage: "Đã thêm 5 bài hát mới",
			time: "24/04",
			active: false,
		},
	]);

	const [activeConversation, setActiveConversation] = useState(1);

	const [messages, setMessages] = useState([
		{
			id: 1,
			text: "Xin chào! Tôi có thể giúp gì cho bạn?",
			sender: "bot",
			time: "10:30 AM",
		},
		{
			id: 2,
			text: "Tôi muốn biết thêm về dịch vụ của bạn",
			sender: "user",
			time: "10:31 AM",
		},
		{
			id: 3,
			text: "Chúng tôi cung cấp nhiều dịch vụ khác nhau. Bạn quan tâm đến lĩnh vực nào?",
			sender: "bot",
			time: "10:32 AM",
		},
	]);

	const selectConversation = (id) => {
		setActiveConversation(id);
		// Update active state
		setConversations(
			conversations.map((conv) => ({ ...conv, active: conv.id === id }))
		);
	};

	// Helper function to find active conversation
	const findActiveConversation = () => {
		return conversations.find((conv) => conv.id === activeConversation);
	};

	const sendMessage = (text) => {
		const newMessage = {
			id: messages.length + 1,
			text: text,
			sender: "user",
			time: new Date().toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			}),
		};

		setMessages([...messages, newMessage]);

		// Update last message in conversation
		setConversations(
			conversations.map((conv) =>
				conv.id === activeConversation
					? { ...conv, lastMessage: text, time: newMessage.time }
					: conv
			)
		);

		// Simulate bot response
		setTimeout(() => {
			const botResponse = {
				id: messages.length + 2,
				text: "Cảm ơn tin nhắn của bạn! Tôi sẽ phản hồi sớm.",
				sender: "bot",
				time: new Date().toLocaleTimeString([], {
					hour: "2-digit",
					minute: "2-digit",
				}),
			};
			setMessages((prev) => [...prev, botResponse]);

			// Update last message in conversation for bot response
			setConversations(
				conversations.map((conv) =>
					conv.id === activeConversation
						? { ...conv, lastMessage: botResponse.text, time: botResponse.time }
						: conv
				)
			);
		}, 1000);
	};

	// Auto scroll to bottom when new messages arrive
	useEffect(() => {
		const scrollToBottom = () => {
			const messageList = document.querySelector(".overflow-y-auto");
			if (messageList) {
				messageList.scrollTop = messageList.scrollHeight;
			}
		};

		scrollToBottom();
	}, [messages]);

	return (
		<div className='flex h-screen bg-[#121212] text-white'>
			<Sidebar
				conversations={conversations}
				activeConversation={activeConversation}
				onSelectConversation={selectConversation}
			/>
			<ChatArea
				activeConversation={activeConversation}
				messages={messages}
				onSendMessage={sendMessage}
				findActiveConversation={findActiveConversation}
			/>
		</div>
	);
};

export default ChatInterface;
