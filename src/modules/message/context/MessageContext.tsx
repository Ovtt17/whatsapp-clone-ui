import { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from 'react';
import { MessageResponse, MessageState, MessageType } from '@/modules/message/types/MessageResponse.ts';
import { getMessages, saveMessage, setMessagesToSeen, uploadMediaMessage } from '@/modules/message/services/messageService.ts';
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
  uploadMedia: (target: EventTarget | null) => void;
}

const MessageContext = createContext<MessageContextProps | undefined>(undefined);

export const MessageProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { chatSelected, setChatSelected, updateOrAddChat } = useChatContext();
  const [chatMessages, setChatMessages] = useState<MessageResponse[]>([]);

  const { keycloakService } = useKeycloak();

  const chatClicked = async (chat: ChatResponse) => {
    chat.unreadCount = 0;
    setChatSelected(chat);

    const messages = await getMessages(chat.id);
    setChatMessages(messages);

    const hasUnreadFromOtherUser = messages.some(
      m => m.state === MessageState.SENT && m.senderId !== keycloakService.userId
    );

    if (hasUnreadFromOtherUser) {
      await setMessagesToSeen(chat.id);
    }
  };

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
          createdAt: new Date().toISOString(),
        };

        if (chatSelected) {
          setChatMessages(prevMessages => [...prevMessages, messageResponse]);
          const updatedChat = {
            ...chatSelected,
            lastMessage: messageContent,
            lastMessageTime: new Date().toISOString(),
          };

          updateOrAddChat(updatedChat);
        }

      }
    }
  }

  const uploadMedia = (target: EventTarget | null) => {
    const file = extractFileFromTarget(target);
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        if (reader.result) {
          const mediaLines = reader.result.toString().split(',')[1];
          await uploadMediaMessage(chatSelected?.id as string, file);

          const message: MessageResponse = {
            senderId: getSenderId(),
            receiverId: getReceiverId(),
            content: 'Attachment',
            type: MessageType.IMAGE,
            state: MessageState.SENT,
            media: [mediaLines],
            createdAt: new Date().toString(),
          };
          setChatMessages(prevMessages => [...prevMessages, message]);
        }
      }
      reader.readAsDataURL(file);
    }
  }

  const extractFileFromTarget = (target: EventTarget | null) => {
    const htmlInputTarget = target as HTMLInputElement;
    if (target === null || htmlInputTarget.files === null) return null;
    return htmlInputTarget.files[0];
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
      isSelfMessage,
      uploadMedia
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