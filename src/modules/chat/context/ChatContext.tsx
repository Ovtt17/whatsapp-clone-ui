import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';
import { ChatResponse } from '../types/ChatResponse.ts';
import { createChat, getChatsByReceiver } from '../services/chatService.ts';
import { UserResponse } from '@/modules/user/types/UserResponse.ts';
import { getAllUsers } from '@/modules/user/types/services/userService.ts';
import { MessageResponse } from '@/modules/message/types/MessageResponse.ts';
import { getMessages } from '@/modules/message/services/messageService.ts';
import KeycloakService from '@/modules/auth/keycloak/KeycloakService.ts';
import { useKeycloak } from '@/modules/auth/keycloak/KeycloakContext.tsx';

interface ChatContextProps {
  chats: ChatResponse[];
  contacts: UserResponse[];
  chatSelected: ChatResponse | null;
  chatMessages: MessageResponse[];
  searchNewContact: boolean;
  setSearchNewContact: Dispatch<SetStateAction<boolean>>;
  searchContact: () => Promise<void>;
  chatClicked: (chat: ChatResponse) => Promise<void>;
  selectContact: (contact: UserResponse) => void;
  isSelfMessage: (chatMessage: MessageResponse) => boolean;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<ChatResponse[]>([]);
  const [contacts, setContacts] = useState<UserResponse[]>([]);
  const [searchNewContact, setSearchNewContact] = useState<boolean>(false);
  const [chatSelected, setChatSelected] = useState<ChatResponse | null>(null);
  const [chatMessages, setChatMessages] = useState<MessageResponse[]>([]);

  const { isAuthenticated } = useKeycloak();

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
    const fetchMessages = async () => {
      if (chatSelected) {
        const messages = await getMessages(chatSelected.id as string);
        setChatMessages(messages);
      }
    }
    fetchMessages();
  }, [chatSelected]);

  useEffect(() => {
    const fetchChats = async () => {
      if (!isAuthenticated) return;
      const allChats = await getChatsByReceiver();
      setChats(allChats);
    }
    fetchChats();
  }, [isAuthenticated]);

  const selectContact = async (contact: UserResponse) => {
    const chatId = await createChat(KeycloakService.userId as string, contact.id);

    const chat: ChatResponse = {
      id: chatId,
      name: `${contact.firstName} ${contact.lastName}`,
      senderId: KeycloakService.userId as string,
      recipientId: contact.id,
      isRecipientOnline: contact.isOnline,
      lastMessageTime: contact.lastSeen,
    }
    setChats(prevChats => [chat, ...prevChats]);
    setSearchNewContact(false);
    setChatSelected(chat);
  }

  const isSelfMessage = (chatMessage: MessageResponse) => {
    return chatMessage.senderId === KeycloakService.userId;
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
      selectContact,
      isSelfMessage
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