import ConversationItem from "../ConversationItem";

const ConversationList = ({
	conversations,
	activeConversation,
	onSelectConversation,
}) => {
	return (
		<div className='overflow-y-auto flex-1'>
			{conversations.map((conversation) => (
				<ConversationItem
					key={conversation.id}
					conversation={conversation}
					isActive={conversation.id === activeConversation}
					onClick={() => onSelectConversation(conversation.id)}
				/>
			))}
		</div>
	);
};

export default ConversationList;
