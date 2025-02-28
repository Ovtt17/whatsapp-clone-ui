import { FC } from 'react';
import ChatListHeader from './ChatListHeader.tsx';
import ChatListSearch from './ChatListSearch.tsx';
import { locale } from 'dayjs';
import ChatItem from './ChatItem.tsx';
import ContactItem from './ContactItem.tsx';
import { useChatContext } from '../../context/ChatContext.tsx';

locale('es');

const ChatList: FC = () => {
  const {
    chats,
    contacts,
    searchNewContact,
    setSearchNewContact,
    searchContact,
    chatClicked,
    selectContact
  } = useChatContext();

  return (
    <section className='sticky top-0 bg-white w-1/4 h-full shadow-2xl p-1'>
      <ChatListHeader
        searchNewContact={searchNewContact}
        setSearchNewContact={setSearchNewContact}
        searchContact={searchContact}
      />
      <ChatListSearch />
      <div className='cursor-pointer hover:bg-[#f2f1f1] mt-3'>
        {chats.length && !searchNewContact ? (
          <>
            {chats.map(chat => (
              <ChatItem
                key={chat.id}
                chat={chat}
                onClick={chatClicked}
              />
            ))}
            {
              searchNewContact && (
                contacts.map(contact => (
                  <ContactItem
                    key={contact.id}
                    contact={contact}
                    onClick={selectContact}
                  />
                ))
              )
            }
          </>
        ) : (
          <small className='text-gray-500'>No chats available</small>
        )}
      </div>
    </section>
  );
}

export default ChatList;
