import { FC } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useChatContext } from '../../context/ChatContext';

const ChatContent: FC = () => {
  const { chatSelected } = useChatContext();

  if (!chatSelected?.id) {
    return (
      <section className='bg-chat w-full h-full flex flex-col items-center justify-center'>
        <figure>
          <img width='300' src="wa_banner.png" alt='WhatsApp Banner' />
        </figure>
        <h2 className='text-3xl font-bold text-gray-500'>WhatsApp Clone Application By Ovett 🧑🏻‍💻</h2>
      </section>
    );
  }

  return (
    <section className='w-3/4 h-full'>
      <div className='relative flex flex-col justify-between h-full'>
        <ChatHeader />
        <MessageList />
        <MessageInput />
      </div>
    </section >
  );
}

export default ChatContent;