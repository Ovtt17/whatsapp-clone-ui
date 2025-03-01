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
    <div className={`flex flex-col ${!isSelf && 'items-end'}`}>
      {message.type === MessageType.TEXT && (
        <span>{message.content}</span>
      )}
      {message.media && (
        <img
          width='200'
          className='cursor-pointer rounded-lg'
          src={`data:image/jpg;base64,${message.media}`}
          alt='chat media'
        />
      )}
      <div className='flex gap-2 justify-end items-center text-sm'>
        <small className='text-gray-600'>{dayjs(message.createdAt).format('HH:mm')}</small>
        {isSelf && (
          <IoCheckmarkDoneSharp
            className={`h-4 w-4 ${message.state === MessageState.SENT ? 'text-gray-500' : 'text-blue-600'}`}
          />
        )}
      </div>
    </div>
  </div>
);


export default MessageItem;