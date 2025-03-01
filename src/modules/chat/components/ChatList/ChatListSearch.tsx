import { FC } from 'react';
import { FaSearch } from 'react-icons/fa';

const ChatListSearch: FC = () => {
  return (
    <article className='flex flex-col gap-2 p-2'>
      <div className='w-full flex items-center border border-gray-300 rounded-md overflow-hidden'>
        <span className='flex items-center px-3 bg-gray-100 border-r border-gray-300'>
          <FaSearch className='h-4 w-4 text-xs text-black' />
        </span>
        <input
          type="text"
          className='text-xs w-full h-8 px-2 py-1 focus:outline-none'
          placeholder='Search in the chat'
          aria-label='Search'
        />
      </div>
      <div className='flex gap-2'>
        <span className='bg-gray-100 text-black text-xs font-bold rounded-md cursor-pointer'>All</span>
        <span className='bg-gray-100 text-black text-xs font-bold rounded-md cursor-pointer'>Unread</span>
        <span className='bg-gray-100 text-black text-xs font-bold rounded-md cursor-pointer'>Favorites</span>
      </div>
    </article>
  );
}

export default ChatListSearch;