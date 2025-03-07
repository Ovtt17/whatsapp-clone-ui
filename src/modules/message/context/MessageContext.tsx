import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';
import { MessageResponse, MessageType } from '@/modules/message/types/MessageResponse.ts';
import { getMessages, saveMessage, setMessagesToSeen } from '@/modules/message/services/messageService.ts';
import { useKeycloak } from '@/modules/auth/keycloak/KeycloakContext.tsx';
import { MessageRequest } from '@/modules/message/types/MessageRequest.ts';
import { ChatResponse } from '@/modules/chat/types/ChatResponse';
import { useChatContext } from '@/modules/chat/context/ChatContext';

interface MessageContextProps {
  chatMessages: MessageResponse[];
  setChatMessages: Dispatch<SetStateAction<MessageResponse[]>>;
  chatClicked: (chat: ChatResponse) => void;
  sendMessage: (messageContent: string) => Promise<void>;
  isSelfMessage: (chatMessage: MessageResponse) => boolean;
}

const MessageContext = createContext<MessageContextProps | undefined>(undefined);

export const MessageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { chatSelected, setChatSelected } = useChatContext();
  const [chatMessages, setChatMessages] = useState<MessageResponse[]>([]);

  const { keycloakService } = useKeycloak();

  const chatClicked = async (chat: ChatResponse) => {
    chat.unreadCount = 0;
    setChatSelected(chat);
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
        // const messageResponse: MessageResponse = {
        //   senderId: messageRequest.senderId,
        //   receiverId: messageRequest.receiverId,
        //   content: messageRequest.content,
        //   type: messageRequest.type,
        //   state: MessageState.SENT,
        //   createdAt: new Date().toString(),
        // };

        setChatSelected(prevChat => prevChat ? { ...prevChat, lastMessage: messageContent } : prevChat);
        // setChatMessages(prevMessages => [...prevMessages, messageResponse]);
      }
    }
  }

  const isSelfMessage = (chatMessage: MessageResponse) => {
    return chatMessage.senderId === keycloakService.userId as string;
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
    <MessageContext.Provider value={{
      chatMessages,
      setChatMessages,
      chatClicked,
      sendMessage,
      isSelfMessage
    }}>
      {children}
    </MessageContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessageContext must be used within a MessageProvider');
  }
  return context;
}