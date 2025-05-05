import Headerbar from "../Headerbar";
import Searchbar from "../Searchbar";
import ConversationList from "../ConversationList";

const ChatSidebarInterface = ({
	conversations,
	activeConversation,
	onSelectConversation,
}) => {
	return (
		<div className='w-1/3 border border-gray-800 flex flex-col rounded-tl-lg'>
			<Headerbar />
			<Searchbar />
			<ConversationList
				conversations={conversations}
				activeConversation={activeConversation}
				onSelectConversation={onSelectConversation}
			/>
		</div>
	);
};

export default ChatSidebarInterface;
