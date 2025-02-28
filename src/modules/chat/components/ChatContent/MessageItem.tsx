import { FC } from 'react';
import { MessageResponse, MessageState, MessageType } from '@/modules/message/types/MessageResponse';
import dayjs from 'dayjs';
import { IoCheckmarkDoneSharp } from "react-icons/io5";
import './MessageItem.css';

interface MessageItemProps {
  message: MessageResponse;
  isSelf: boolean;
}

const MessageItem: FC<MessageItemProps> = ({ message, isSelf }) => (
  <div className={`message-box ${isSelf ? 'self' : 'friend'}`}>
    <div>
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
);

export default MessageItem;