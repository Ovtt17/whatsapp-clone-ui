import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';
import { ChatResponse } from '../types/ChatResponse.ts';
import { createChat, getChatsByReceiver } from '../services/chatService.ts';
import { UserResponse } from '@/modules/user/types/UserResponse.ts';
import { useKeycloak } from '@/modules/auth/keycloak/KeycloakContext.tsx';
import { useContactContext } from '@/modules/user/context/ContactContext.tsx';

interface ChatContextProps {
  chats: ChatResponse[];
  setChats: Dispatch<SetStateAction<ChatResponse[]>>;
  chatSelected: ChatResponse | null;
  setChatSelected: Dispatch<SetStateAction<ChatResponse | null>>;
  initializeChatWithContact: (contact: UserResponse) => void;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<ChatResponse[]>([]);
  const [chatSelected, setChatSelected] = useState<ChatResponse | null>(null);

  const { isAuthenticated, keycloakService } = useKeycloak();
  const { setSearchNewContact } = useContactContext();

  useEffect(() => {
    const fetchChats = async () => {
      if (!isAuthenticated) return;
      const allChats = await getChatsByReceiver();
      setChats(allChats);
    }
    fetchChats();
  }, [isAuthenticated]);

  const initializeChatWithContact = async (contact: UserResponse) => {
    const existingChat = chats.find(chat =>
      (chat.senderId === keycloakService.userId && chat.receiverId === contact.id) ||
      (chat.receiverId === keycloakService.userId && chat.senderId === contact.id)
    );

    if (existingChat) {
      setChatSelected(existingChat);
      setSearchNewContact(false);
      return;
    }

    const chatId = await createChat(keycloakService.userId as string, contact.id);

    const chat: ChatResponse = {
      id: chatId,
      name: `${contact.firstName} ${contact.lastName}`,
      senderId: keycloakService.userId as string,
      receiverId: contact.id,
      isRecipientOnline: contact.isOnline,
      lastMessageTime: contact.lastSeen,
    }
    setChats(prevChats => [...prevChats, chat]);
    setSearchNewContact(false);
    setChatSelected(chat);
  }

  return (
    <ChatContext.Provider value={{
      chats,
      setChats,
      chatSelected,
      setChatSelected,
      initializeChatWithContact,
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