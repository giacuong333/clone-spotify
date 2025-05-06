import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { useUser } from "../User";
import { instance } from "../Axios";
import { apis } from "../../constants/apis";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);

	const [conversations, setConversations] = useState([]);
	const [activeConversation, setActiveConversation] = useState(null);
	const [messages, setMessages] = useState([]);
	const [inputMessage, setInputMessage] = useState("");
	const [loadingConversations, setLoadingConversations] = useState(false);
	const [loadingMessages, setLoadingMessages] = useState(false);
	const [error, setError] = useState("");
	const messageEndRef = useRef(null);
	const { user } = useUser();

	// useEffect(() => {
	// 	const newSocket = new WebSocket(
	// 		`ws://${window.location.host}/ws/chat/6818411a5386cc4d0d43be88/680755a0081908b550ef9a45/`
	// 	);
	// 	// Xử lý khi kết nối mở
	// 	newSocket.onopen = () => {
	// 		console.log("WebSocket connected");
	// 	};

	// 	// Xử lý khi nhận tin nhắn
	// 	newSocket.onmessage = (event) => {
	// 		const data = JSON.parse(event.data);
	// 		setMessages((prev) => [
	// 			...prev,
	// 			{
	// 				id: data.messageId,
	// 				text: data.message,
	// 				sender: data.senderId,
	// 				timestamp: data.timestamp,
	// 			},
	// 		]);
	// 	};

	// 	// Xử lý khi kết nối đóng
	// 	newSocket.onclose = () => {
	// 		console.log("WebSocket disconnected");
	// 	};

	// 	setSocket(newSocket);

	// 	// Cleanup khi component unmount
	// 	return () => {
	// 		if (newSocket) newSocket.close();
	// 	};
	// }, []);

	const fetchConversations = useCallback(async () => {
		try {
			setLoadingConversations(true);

			const response = await instance.get(apis.chats.getConversations());
			console.log("Response: ", response);

			// const mockData = [
			// 	{
			// 		id: 1,
			// 		name: "Spotify Support",
			// 		avatar: "S",
			// 		unread: 0,
			// 		lastMessage: "Chúng tôi cung cấp nhiều dịch vụ khác nhau...",
			// 		time: "10:32 AM",
			// 		active: true,
			// 	},
			// 	{
			// 		id: 2,
			// 		name: "Nhóm Âm nhạc",
			// 		avatar: "N",
			// 		unread: 3,
			// 		lastMessage: "Hãy chia sẻ những bài hát mới",
			// 		time: "09:45 AM",
			// 		active: false,
			// 	},
			// 	{
			// 		id: 3,
			// 		name: "DJ Hoàng",
			// 		avatar: "H",
			// 		unread: 0,
			// 		lastMessage: "Playlist đã được cập nhật",
			// 		time: "Hôm qua",
			// 		active: false,
			// 	},
			// 	{
			// 		id: 4,
			// 		name: "Hỗ trợ kỹ thuật",
			// 		avatar: "H",
			// 		unread: 0,
			// 		lastMessage: "Vấn đề đã được giải quyết",
			// 		time: "Thứ 2",
			// 		active: false,
			// 	},
			// 	{
			// 		id: 5,
			// 		name: "Phòng nhạc",
			// 		avatar: "P",
			// 		unread: 0,
			// 		lastMessage: "Đã thêm 5 bài hát mới",
			// 		time: "24/04",
			// 		active: false,
			// 	},
			// ];
		} catch (error) {
			console.log("Error occurs while fetching conversations:", error);
		} finally {
			setLoadingConversations(false);
		}
	}, []);

	// const fetchMessages = useCallback(async (conversationId) => {
	// 	if (!conversationId) {
	// 		return;
	// 	}

	// 	try {
	// 		setLoadingMessages(true);
	// 	} catch (error) {
	// 		console.log("Error occurs while fetching conversations:", error);
	// 	} finally {
	// 		setLoadingMessages(false);
	// 	}
	// }, []);

	// const sendMessage = async (event) => {
	// 	event.preventDefault();

	// 	if (!inputMessage.trim() || !socket) return;

	// 	const messageData = {
	// 		message: inputMessage,
	// 		senderId: "6818411a5386cc4d0d43be88",
	// 		receiverId: "680755a0081908b550ef9a45",
	// 	};

	// 	socket.send(JSON.stringify(messageData));
	// 	setInputMessage("Hello world");
	// };

	return <ChatContext.Provider value={{}}>{children}</ChatContext.Provider>;
};

export const useChat = () => useContext(ChatContext);

export default ChatProvider;
