import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { useUser } from "../User";
import { useAuth } from "../Auth";
import { instance } from "../Axios";
import { apis } from "../../constants/apis";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
	const [socket, setSocket] = useState(null);
	const [conversations, setConversations] = useState([]);
	const [loadingConversations, setLoadingConversations] = useState(false);
	const [activeConversation, setActiveConversation] = useState(null);
	const [messages, setMessages] = useState([]);
	const [loadingMessages, setLoadingMessages] = useState(false);
	const [inputMessage, setInputMessage] = useState("");
	const [error, setError] = useState("");
	const messageEndRef = useRef(null);

	const [searchUserInput, setSearchUserInput] = useState("");
	const { searchUserResult } = useUser();
	const { user } = useAuth();

	// Connect to WebSocket when activeConversation changes
	useEffect(() => {
		// Close previous socket connection if exists
		if (socket) {
			socket.close();
		}

		// Only create a new socket if we have an active conversation and user
		if (activeConversation && user?.id) {
			const newSocket = new WebSocket(
				`ws://${import.meta.env.VITE_SOCKET_URL}/ws/chat/${
					user?.id
				}/${activeConversation}/`
			);

			// Handle connection open
			newSocket.onopen = () => {
				console.log("WebSocket connected");
			};

			// Handle incoming messages
			newSocket.onmessage = (event) => {
				const data = JSON.parse(event.data);
				setMessages((prev) => [
					...prev,
					{
						id: data.messageId,
						text: data.message,
						sender: data.senderId,
						timestamp: data.timestamp,
						time: new Date(data.timestamp).toLocaleTimeString([], {
							hour: "2-digit",
							minute: "2-digit",
						}),
					},
				]);

				// Scroll to bottom when new message arrives
				if (messageEndRef.current) {
					messageEndRef.current.scrollIntoView({ behavior: "smooth" });
				}
			};

			// Handle connection close
			newSocket.onclose = () => {
				console.log("WebSocket disconnected");
			};

			// Handle connection errors
			newSocket.onerror = (error) => {
				console.error("WebSocket error:", error);
				setError("Connection error. Please try again later.");
			};

			setSocket(newSocket);

			// Fetch messages for this conversation
			fetchMessages(activeConversation);

			// Cleanup when component unmounts or conversation changes
			return () => {
				if (newSocket) {
					newSocket.close();
				}
			};
		}
	}, [activeConversation, user?.id]);

	// Scroll to bottom when messages change
	useEffect(() => {
		if (messageEndRef.current) {
			messageEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	const fetchConversations = useCallback(async () => {
		try {
			setLoadingConversations(true);
			setError("");

			const response = await instance.get(apis.chats.getConversations());

			if (response.status === 200 && response.data) {
				// Format the conversations data properly
				const formattedConversations = response.data.map((conversation) => {
					const newConversation = conversation.participants?.find(
						(p) => p.id !== user?.id
					);
					return {
						id: newConversation.id,
						name: newConversation?.name || "Unknown",
						avatar: newConversation?.name?.charAt(0) || "?",
						unread: conversation.unread_count || 0,
						lastMessage:
							conversation.last_message?.content || "No messages yet",
						time: new Date(conversation.updated_at).toLocaleDateString(),
						active: false,
					};
				});

				setConversations(formattedConversations);
			}
		} catch (error) {
			console.error("Error fetching conversations:", error);
			setError("Failed to load conversations");
		} finally {
			setLoadingConversations(false);
		}
	}, [user?.id]);

	const fetchMessages = useCallback(async (otherUserId) => {
		if (!otherUserId) {
			return;
		}

		try {
			setLoadingMessages(true);
			setError("");

			// In your implementation, conversationId seems to be the other user's ID
			const response = await instance.get(apis.chats.getMessages(otherUserId));
			if (response.status === 200 && response.data) {
				// Format the messages data
				const formattedMessages = response.data.map((msg) => ({
					id: msg.id,
					text: msg.content,
					sender: { id: msg.sender.id, name: msg.sender.name },
					timestamp: msg.timestamp,
					time: new Date(msg.timestamp).toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					}),
				}));

				setMessages(formattedMessages);
			}
		} catch (error) {
			console.error("Error fetching messages:", error);
			setError("Failed to load messages");
		} finally {
			setLoadingMessages(false);
		}
	}, []);

	const sendMessage = useCallback(
		(event) => {
			event?.preventDefault();

			if (!inputMessage.trim() || !socket || !activeConversation || !user?.id) {
				return;
			}

			try {
				const messageData = {
					message: inputMessage,
					senderId: user.id,
					receiverId: activeConversation,
				};

				socket.send(JSON.stringify(messageData));
				setInputMessage("");
			} catch (error) {
				console.error("Error sending message:", error);
				setError("Failed to send message");
			}
		},
		[inputMessage, socket, activeConversation, user?.id]
	);

	return (
		<ChatContext.Provider
			value={{
				searchUserInput,
				setSearchUserInput,
				searchUserResult,

				inputMessage,
				setInputMessage,
				sendMessage,

				conversations,
				setConversations,
				loadingConversations,
				fetchConversations,

				messages,
				setMessages,
				loadingMessages,
				fetchMessages,

				activeConversation,
				setActiveConversation,

				error,
				messageEndRef,
			}}>
			{children}
		</ChatContext.Provider>
	);
};

export const useChat = () => useContext(ChatContext);
export default ChatProvider;
