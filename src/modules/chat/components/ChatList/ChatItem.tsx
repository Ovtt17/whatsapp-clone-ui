import { FC } from 'react';
import { ChatResponse } from "../../types/ChatResponse.ts";
import { FaImage } from 'react-icons/fa';
import dayjs from 'dayjs';
import { useMessageContext } from '@/modules/message/context/MessageContext.tsx';

interface ChatItemProps {
  chat: ChatResponse;
}

const ChatItem: FC<ChatItemProps> = ({ chat }) => {
  const { chatClicked } = useMessageContext();

  const wrapMessage = (lastMessage: string | undefined) => {
    if (!lastMessage) {
      return 'No messages';
    }
    if (lastMessage && lastMessage.length <= 30) {
      return lastMessage;
    }
    return lastMessage?.substring(0, 27) + '...';
  };

  return (
    <article
      className="flex justify-between items-center border-b border-gray-200 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
      onClick={() => chatClicked(chat)}
      role="button"
      tabIndex={0}
    >
      <div className="flex items-start gap-4">
        <figure className="w-11 h-11 rounded-full overflow-hidden border border-gray-300">
          <img src="user.png" alt={`${chat.name}'s profile picture`} className="w-full h-full object-cover" />
        </figure>

        <div className="flex flex-col">
          <h2 className="text-base font-semibold text-gray-800">{chat.name}</h2>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            {chat.lastMessage === 'Attachment' && <FaImage className="w-4 h-4 text-gray-400" />}
            {wrapMessage(chat.lastMessage)}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1 min-w-[60px]">
        <time
          className={`text-xs ${(chat.unreadCount ?? 0) > 0 ? 'text-[#1fa855] font-semibold' : 'text-gray-400'
            }`}
          dateTime={dayjs(chat.lastMessageTime).format()}
        >
          {dayjs(chat.lastMessageTime).format('DD/MM/YY')}
        </time>
        {(chat.unreadCount ?? 0) > 0 && (
          <span className="bg-[#1fa855] text-white rounded-full px-2 py-0.5 text-xs font-medium leading-none">
            {chat.unreadCount}
          </span>
        )}
      </div>
    </article>
  );
};

export default ChatItem;