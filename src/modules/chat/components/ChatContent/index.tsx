import { FC } from 'react';
import ChatHeader from './ChatHeader';
import MessageList from './MessageList';

const ChatContent: FC = () => {
  return (
    <section className='w-3/4 h-full'>
      <div className='flex flex-col justify-between h-full'>
        <ChatHeader />
        <MessageList />
      </div>
    </section >
  );
}

export default ChatContent;