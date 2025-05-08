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

		console.table({
			"activeConversation: ": activeConversation,
			"user: ": user?.id,
		});

		// Only create a new socket if we have an active conversation and user
		if (activeConversation && user?.id) {
			const newSocket = new WebSocket(
				`ws://${import.meta.env.VITE_BASE_URL}/chat/${
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
			console.log("Conversations response:", response);

			if (response.data) {
				// Format the conversations data properly
				const formattedConversations = response.data.map((conv) => ({
					id: conv.id,
					name:
						conv.participants?.find((p) => p.id !== user?.id)?.username ||
						"Unknown",
					avatar:
						conv.participants
							?.find((p) => p.id !== user?.id)
							?.username?.charAt(0) || "?",
					unread: conv.unread_count || 0,
					lastMessage: conv.last_message?.content || "No messages yet",
					time: new Date(conv.updated_at).toLocaleDateString(),
					active: false,
				}));

				setConversations(formattedConversations);
			}
		} catch (error) {
			console.error("Error fetching conversations:", error);
			setError("Failed to load conversations");
		} finally {
			setLoadingConversations(false);
		}
	}, [user?.id]);

	const fetchMessages = useCallback(async (conversationId) => {
		// if (!conversationId) {
		// 	return;
		// }

		try {
			setLoadingMessages(true);
			setError("");

			const otherUserId = activeConversation; // In your implementation, conversationId seems to be the other user's ID
			const response = await instance.get(apis.chats.getMessages(otherUserId));

			if (response.data) {
				// Format the messages data
				const formattedMessages = response.data.map((msg) => ({
					id: msg.id,
					text: msg.content,
					sender: msg.sender.id,
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

			console.log({
				"Message: ": inputMessage,
				"Active conversation: ": activeConversation,
				"User Id: ": user?.id,
			});

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

	// New function to start a conversation with a user from search results
	const startNewConversation = useCallback(
		async (userId) => {
			try {
				setError("");

				// Check if conversation already exists
				const existingConv = conversations.find((conv) =>
					conv.participants?.some((p) => p.id === userId)
				);

				if (existingConv) {
					setActiveConversation(existingConv.id);
					return;
				}

				// If no existing conversation, set the active conversation to the user ID
				// The backend will create the conversation when the first message is sent
				setActiveConversation(userId);

				// Clear messages since this is a new conversation
				setMessages([]);

				// Clear search input
				setSearchUserInput("");
			} catch (error) {
				console.error("Error starting new conversation:", error);
				setError("Failed to start conversation");
			}
		},
		[conversations]
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
				startNewConversation,

				error,
				messageEndRef,
			}}>
			{children}
		</ChatContext.Provider>
	);
};

export const useChat = () => useContext(ChatContext);

export default ChatProvider;
