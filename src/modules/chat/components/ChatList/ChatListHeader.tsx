import { FaCommentMedical, FaTimesCircle } from 'react-icons/fa';
import { useChatContext } from '../../context/ChatContext';
import { FC } from 'react';

const ChatListHeader: FC = () => {
  const { searchNewContact, setSearchNewContact, searchContact } = useChatContext();

  const handleIconClick = () => {
    if (searchNewContact) {
      setSearchNewContact(false);
    } else {
      searchContact();
    }
  };

  return (
    <article className='flex justify-between items-center gap-2 p-2'>
      <h4 className='text-xl font-semibold'>Chat</h4>
      <span onClick={handleIconClick} className='cursor-pointer'>
        {searchNewContact ? (
          <FaTimesCircle className='h-6 w-6 text-black' />
        ) : (
          <FaCommentMedical className='h-6 w-6 text-black' />
        )}
      </span>
    </article>
  );
};

export default ChatListHeader;