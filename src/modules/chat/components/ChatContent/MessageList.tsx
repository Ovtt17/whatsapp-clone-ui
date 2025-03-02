import { useEffect, useRef } from "react";
import MessageItem from "./MessageItem";
import { useMessageContext } from "@/modules/message/context/MessageContext";

const MessageList = () => {
  const { chatMessages, isSelfMessage } = useMessageContext();
  const lastMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView();
  }, [chatMessages]);

  return (
    <article className='h-full bg-chat p-3 no-scrollbar overflow-y-auto'>
      {chatMessages.length ? (
        chatMessages.map((message, index) => (
          <div key={index} ref={index === chatMessages.length - 1 ? lastMessageRef : null}>
            <MessageItem message={message} isSelf={isSelfMessage(message)} />
          </div>
        ))
      ) : (
        <small className='text-gray-500'>No messages available</small>
      )}
    </article>
  );
};

export default MessageList;
