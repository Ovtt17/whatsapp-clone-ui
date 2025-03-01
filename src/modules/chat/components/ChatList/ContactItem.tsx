import { FC } from 'react';
import { UserResponse } from '@/modules/user/types/UserResponse.ts';
import dayjs from 'dayjs';

interface ContactItemProps {
  contact: UserResponse;
  onClick: (contact: UserResponse) => void;
}

const ContactItem: FC<ContactItemProps> = ({ contact, onClick }) => {
  return (
    <article className='flex justify-between items-center border-b border-b-gray-300 p-2' onClick={() => onClick(contact)} role="button" tabIndex={0}>
      <div className='flex gap-2'>
        <figure className='user-img'>
          <img src="user.png" alt={`${contact.firstName} ${contact.lastName}'s profile picture`} />
        </figure>
        <div className='flex flex-col'>
          <h2 className='text-lg font-semibold'>{contact.firstName} {contact.lastName}</h2>
          {contact.isOnline
            ? (<p className='text-gray-400'>Online</p>)
            : (<time className='text-gray-400' dateTime={dayjs(contact.lastSeen).format()}>{dayjs(contact.lastSeen).format('DD:MM:YY HH:mm')}</time>)
          }
        </div>
      </div>
    </article>
  );
}

export default ContactItem;