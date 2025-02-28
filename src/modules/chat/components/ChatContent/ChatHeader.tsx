import { FC } from 'react';
import { useChatContext } from '../../context/ChatContext';

const ChatHeader: FC = () => {
  const { chatSelected } = useChatContext();

  return (
    <article className='flex gap-2 gray-bg p-2'>
      {chatSelected && (
        <>
          <figure className='user-img'>
            <img src="user.png" alt="" />
          </figure>
          <div className='flex flex-col'>
            <span>{chatSelected.name}</span>
            <div className='flex gap-1 items-center'>
              {chatSelected.isRecipientOnline ? (
                <>
                  <small className='flex justify-center items-center bg-[#1ea885] min-w-3 max-w-3 h-3 rounded-full text-xs font-normal'></small>
                  <small>Online</small>
                </>
              ) : (
                <>
                  <small className='flex justify-center items-center bg-[#cacaca] min-w-3 max-w-3 h-3 rounded-full text-xs font-normal'></small>
                  <small>Offline</small>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </article>
  )
};

export default ChatHeader;