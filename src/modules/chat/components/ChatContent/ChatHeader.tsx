import { FC } from 'react';
import { useChatContext } from '../../context/ChatContext';

const ChatHeader: FC = () => {
  const { chatSelected } = useChatContext();

  if (!chatSelected) {
    return null;
  }

  return (
    <article className='flex gap-2 gray-bg p-2'>
      <figure className='user-img'>
        <img src="user.png" alt="" />
      </figure>
      <div className='flex flex-col'>
        <span>{chatSelected.name}</span>
        <div className='flex gap-1 items-center'>
          <small
            className={`flex justify-center items-center min-w-3 max-w-3 h-3 rounded-full text-xs font-normal ${
              chatSelected.recipientOnline ? 'bg-[#1ea885]' : 'bg-[#cacaca]'
            }`}
          ></small>
          <small>{chatSelected.recipientOnline ? 'Online' : 'Offline'}</small>
        </div>
      </div>
    </article>
  );
};

export default ChatHeader;