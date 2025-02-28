import { FaCommentMedical, FaTimesCircle } from 'react-icons/fa';
import { useChatContext } from '../../context/ChatContext';
import { FC } from 'react';

const ChatListHeader: FC = () => {
  const { searchNewContact, setSearchNewContact, searchContact} = useChatContext();
  return (
    <article className='flex justify-between items-center gap-2 p-2'>
      <h4 className='text-xl font-semibold'>Chat</h4>
      {searchNewContact
        ? <span onClick={searchContact}><FaCommentMedical className='h-6 w-6 text-black cursor-pointer' /></span>
        : <span onClick={() => { setSearchNewContact(false) }} ><FaTimesCircle className='h-6 w-6 text-black cursor-pointer' /></span>
      }
    </article>
  );
}

export default ChatListHeader;