import Headerbar from "../Headerbar";
import Searchbar from "../Searchbar";
import ConversationList from "../ConversationList";
import { useChat } from "../../../../contexts/Chat";
import { useUser } from "../../../../contexts/User";

const ChatSidebarInterface = ({
	conversations,
	activeConversation,
	onSelectConversation,
}) => {
	const { searchUserResult } = useUser();

	return (
		<div className='w-1/3 border border-gray-800 flex flex-col rounded-tl-lg'>
			<Headerbar />
			<Searchbar />
			<ConversationList
				conversations={searchUserResult}
				activeConversation={activeConversation}
				onSelectConversation={onSelectConversation}
			/>
		</div>
	);
};

export default ChatSidebarInterface;
