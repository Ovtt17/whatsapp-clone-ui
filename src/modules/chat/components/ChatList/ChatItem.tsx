import { FC } from 'react';
import { ChatResponse } from "../../types/ChatResponse.ts";
import { FaImage } from 'react-icons/fa';
import dayjs from 'dayjs';

interface ChatItemProps {
  chat: ChatResponse;
  onClick: (chat: ChatResponse) => void;
}

const ChatItem: FC<ChatItemProps> = ({ chat, onClick }) => {
  const wrapMessage = (lastMessage: string | undefined) => {
    if (!lastMessage) {
      return 'No messages';
    }
    if (lastMessage && lastMessage.length <= 30) {
      return lastMessage;
    }
    return lastMessage?.substring(0, 27) + '...';
  }
  return (
    <article className='flex justify-between border-b border-gray-300 p-2' onClick={() => onClick(chat)} role="button" tabIndex={0}>
      <div className='flex gap-2'>
        <figure className='user-img'>
          <img src="user.png" alt={`${chat.name}'s profile picture`} />
        </figure>
        <div className='flex flex-col'>
          <h2 className='text-lg font-semibold'>{chat.name}</h2>
          <p className='text-gray-500'>
            {chat.lastMessage === 'Attachment' && <FaImage className='h-3 w-3' />}
            {wrapMessage(chat.lastMessage)}
          </p>
        </div>
      </div>
      <div className='flex flex-col items-end'>
        <time className={`text-md ${chat.unreadCount && chat.unreadCount > 0 ? 'text-[#1fa855] font-medium' : 'text-gray-500'}`} dateTime={dayjs(chat.lastMessageTime).format()}>
          {dayjs(chat.lastMessageTime).format('DD/MM/YY')}
        </time>
        {(chat.unreadCount ?? 0) > 0 && (
          <span className='flex justify-center items-center bg-[#1fa855] text-white min-w-5 h-5 rounded-full px-1 text-sm font-normal'>
            {chat.unreadCount}
          </span>
        )}
      </div>
    </article>
  );
}

export default ChatItem;