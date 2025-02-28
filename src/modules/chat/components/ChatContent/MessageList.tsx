import { useChatContext } from "../../context/ChatContext";
import MessageItem from "./MessageItem";

const MessageList = () => {
  const { chatMessages, isSelfMessage } = useChatContext();

  return (
    <article className='h-full bg-chat p-3 no-scrollbar overflow-y-auto'>
      {chatMessages.length ? (
        chatMessages.map(message => (
          <MessageItem
            key={message.id}
            message={message}
            isSelf={isSelfMessage(message)}
          />
        ))
      ) : (
        <small className='text-gray-500'>No messages available</small>
      )}
    </article>
  )
};

export default MessageList;