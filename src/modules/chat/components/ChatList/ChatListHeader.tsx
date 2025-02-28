import { FC } from 'react';
import { FaCommentMedical, FaTimesCircle } from 'react-icons/fa';

interface ChatListHeaderProps {
  searchNewContact: boolean;
  setSearchNewContact: (value: boolean) => void;
  searchContact: () => void;
}

const ChatListHeader: FC<ChatListHeaderProps> = ({ searchNewContact, setSearchNewContact, searchContact }) => {
  return (
    <article className='flex justify-between items-center gap-2 p-2'>
      <h4 className='text-xl font-semibold'>Chat</h4>
      {searchNewContact
        ? <span onClick={searchContact}><FaCommentMedical className='h-6 w-6 text-black' /></span>
        : <span onClick={() => { setSearchNewContact(false) }} ><FaTimesCircle className='h-6 w-6 text-black' /></span>
      }
    </article>
  );
}

export default ChatListHeader;