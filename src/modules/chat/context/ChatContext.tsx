import { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react';
import { ChatResponse } from '../types/ChatResponse.ts';
import { getChatsByReceiver } from '../services/chatService.ts';
import { UserResponse } from '@/modules/user/types/UserResponse.ts';
import { getAllUsers } from '@/modules/user/types/services/userService.ts';
import { MessageResponse } from '@/modules/message/types/MessageResponse.ts';
import { getMessages } from '@/modules/message/services/messageService.ts';

interface ChatContextProps {
  chats: ChatResponse[];
  contacts: UserResponse[];
  chatSelected: ChatResponse | null;
  chatMessages: MessageResponse[];
  searchNewContact: boolean;
  setSearchNewContact: (value: boolean) => void;
  searchContact: () => Promise<void>;
  chatClicked: (chat: ChatResponse) => Promise<void>;
  selectContact: (contact: UserResponse) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<ChatResponse[]>([]);
  const [contacts, setContacts] = useState<UserResponse[]>([]);
  const [searchNewContact, setSearchNewContact] = useState<boolean>(true);
  const [chatSelected, setChatSelected] = useState<ChatResponse | null>(null);
  const [chatMessages, setChatMessages] = useState<MessageResponse[]>([]);

  const searchContact = async () => {
    const allContacts = await getAllUsers();
    setContacts(allContacts);
    setSearchNewContact(true);
  }

  const chatClicked = async (chat: ChatResponse) => {
    setChatSelected(chat);
    const messages = await getMessages(chat.id);
    setChatMessages(messages);
  }

  useEffect(() => {
    const fetchChats = async () => {
      const allChats = await getChatsByReceiver();
      setChats(allChats);
      console.log(allChats);
    }
    fetchChats();
  }, []);

  const selectContact = (contact: UserResponse) => {
    console.log(contact);
  }

  return (
    <ChatContext.Provider value={{
      chats,
      contacts,
      chatSelected,
      chatMessages,
      searchNewContact,
      setSearchNewContact,
      searchContact,
      chatClicked,
      selectContact
    }}>
      {children}
    </ChatContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
}