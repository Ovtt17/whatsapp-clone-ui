import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';
import { ChatResponse } from '../types/ChatResponse.ts';
import { createChat, getChatsByReceiver } from '../services/chatService.ts';
import { UserResponse } from '@/modules/user/types/UserResponse.ts';
import { getAllUsers } from '@/modules/user/types/services/userService.ts';
import { MessageResponse, MessageState, MessageType } from '@/modules/message/types/MessageResponse.ts';
import { getMessages, saveMessage, setMessagesToSeen } from '@/modules/message/services/messageService.ts';
import { useKeycloak } from '@/modules/auth/keycloak/KeycloakContext.tsx';
import { MessageRequest } from '@/modules/message/types/MessageRequest.ts';

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
  sendMessage: (messageContent: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextProps | undefined>(undefined);

export const ChatProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<ChatResponse[]>([]);
  const [contacts, setContacts] = useState<UserResponse[]>([]);
  const [searchNewContact, setSearchNewContact] = useState<boolean>(false);
  const [chatSelected, setChatSelected] = useState<ChatResponse | null>(null);
  const [chatMessages, setChatMessages] = useState<MessageResponse[]>([]);

  const { isAuthenticated, keycloakService } = useKeycloak();

  const searchContact = async () => {
    const allContacts = await getAllUsers();
    setContacts(allContacts);
    setSearchNewContact(true);
  }

  const chatClicked = async (chat: ChatResponse) => {
    setChatSelected(prevChat => ({
      ...prevChat,
      ...chat,
      unreadCount: 0
    }));
    const messages = await getMessages(chat.id);
    setChatMessages(messages);
    await setMessagesToSeen(chat.id);
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

  const isSelfMessage = (chatMessage: MessageResponse) => {
    return chatMessage.senderId === keycloakService.userId as string;
  }

  const sendMessage = async (messageContent: string) => {
    if (messageContent) {
      const messageRequest: MessageRequest = {
        chatId: chatSelected?.id as string,
        senderId: getSenderId(),
        receiverId: getReceiverId(),
        content: messageContent,
        type: MessageType.TEXT,
      }
      const response = await saveMessage(messageRequest);

      if (response.status === 201) {
        const messageResponse: MessageResponse = {
          senderId: messageRequest.senderId,
          receiverId: messageRequest.receiverId,
          content: messageRequest.content,
          type: messageRequest.type,
          state: MessageState.SENT,
          createdAt: new Date().toString(),
        };

        setChatSelected(prevChat => prevChat ? { ...prevChat, lastMessage: messageContent } : prevChat);
        setChatMessages(prevMessages => [...prevMessages, messageResponse]);
      }
    }
  }

  const getSenderId = () => {
    return chatSelected?.senderId === keycloakService.userId
      ? chatSelected?.senderId as string
      : chatSelected?.receiverId as string;
  }

  const getReceiverId = () => {
    return chatSelected?.senderId === keycloakService.userId
      ? chatSelected?.receiverId as string
      : chatSelected?.senderId as string;
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
      isSelfMessage,
      sendMessage
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