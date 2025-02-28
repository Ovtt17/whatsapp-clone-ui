import { FC } from 'react';
import { useChatContext } from '../../context/ChatContext';
import { MessageState, MessageType } from '@/modules/message/types/MessageResponse';
import dayjs from 'dayjs';
import { IoCheckmarkDoneSharp } from "react-icons/io5";

const ChatContent: FC = () => {
  const { chatSelected, chatMessages, isSelfMessage } = useChatContext();

  return (
    <section className='w-3/4 h-full'>
      <article className='flex flex-col justify-between h-full'>
        <div className='gray-bg p-2'>
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
        </div>

        <div className='h-full bg-chat p-3 overflow-x-scroll'>
          {chatMessages.length ? (
            chatMessages.map(message => (
              isSelfMessage(message) ? (
                <div className='relative flex justify-end w-full mx-1 my-0'>
                  <div className='relative right-0 text-right bg-[#d9fdd3] max-w-[65%] rounded-sm text-[0.9rem] p-3'>
                    <div className='flex flex-col items-end'>
                      {message.type === MessageType.TEXT && (
                        <span>{message.content}</span>
                      )}
                      {message.media && (
                        <img
                          width='200'
                          className='cursor-pointer'
                          src={`data:image/jpg;base64,${message.media}`}
                          alt='chat media'
                        />
                      )}
                      <div className='flex gap-2 justify-end items-center'>
                        <small className='text-black'>{dayjs(message.createdAt).format('HH:mm')}</small>
                        {message.state === MessageState.SENT && (
                          <span>
                            <IoCheckmarkDoneSharp className='h-4 w-4 text-gray-500' />
                          </span>
                        )}
                        {message.state === MessageState.SEEN && (
                          <IoCheckmarkDoneSharp className='h-4 w-4 text-blue-600 -ml-[7x]' />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className='relative flex justify-start w-full mx-1 my-0'>
                  <div className='relative right-0 text-right bg-gray-100 max-w-[65%] rounded-sm text-[0.9rem] p-3'>
                    <div className='flex flex-col items-end'>
                      {message.type === MessageType.TEXT && (
                        <span>{message.content}</span>
                      )}
                      {message.media && (
                        <img
                          width='200'
                          className='cursor-pointer'
                          src={`data:image/jpg;base64,${message.media}`}
                          alt='chat media'
                        />
                      )}
                      <div className='flex gap-2 justify-end items-center'>
                        <small className='text-black'>{dayjs(message.createdAt).format('HH:mm')}</small>
                        {message.state === MessageState.SENT && (
                          <span>
                            <IoCheckmarkDoneSharp className='h-4 w-4 text-gray-500' />
                          </span>
                        )}
                        {message.state === MessageState.SEEN && (
                          <IoCheckmarkDoneSharp className='h-4 w-4 text-blue-600 -ml-[7x]' />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            ))
          ) : (
            <small className='text-gray-500'>No messages available</small>
          )}
        </div>
      </article>
    </section >
  );
}

export default ChatContent;