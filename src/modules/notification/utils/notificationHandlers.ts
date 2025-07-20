import { Notification, NotificationType } from '../types/Notification';
import { MessageResponse, MessageState, MessageType } from '@/modules/message/types/MessageResponse';
import { ChatResponse } from '@/modules/chat/types/ChatResponse';
import { Dispatch, SetStateAction } from 'react';
import { setMessagesToSeen } from '@/modules/message/services/messageService';

export const handleNotificationForSelectedChat = async (
  notification: Notification,
  chatSelected: ChatResponse,
  updateOrAddChat: (chatToUpdate: ChatResponse) => void,
  setChatMessages: Dispatch<SetStateAction<MessageResponse[]>>,
  userId: string
) => {
  switch (notification.type) {
    case NotificationType.SEEN: {
      if (notification.senderId !== userId) {
        setChatMessages((prev) =>
          prev.map((msg) => {
            const isMyMessage = msg.senderId === userId;
            const notSeenYet = msg.state !== MessageState.SEEN;
            if (isMyMessage && notSeenYet) {
              return { ...msg, state: MessageState.SEEN };
            }
            return msg;
          })
        );
      }
      break;
    }

    case NotificationType.MESSAGE:
    case NotificationType.IMAGE: {
      const isSenderMe = notification.senderId === userId;
      const isImage = notification.messageType === MessageType.IMAGE;

      const newMessage: MessageResponse = {
        senderId: notification.senderId,
        receiverId: notification.receiverId,
        content: notification.content,
        type: notification.messageType,
        media: notification.media,
        createdAt: new Date().toISOString(),
        state: MessageState.SENT,
      };

      setChatMessages((prev) => [...prev, newMessage]);

      const updatedChat: ChatResponse = {
        ...chatSelected,
        lastMessage: isImage ? 'Attachment' : notification.content,
        lastMessageTime: new Date().toISOString(),
      };

      if (!isSenderMe) {
        try {
          const response = await setMessagesToSeen(chatSelected.id);
          if (response.status === 202) {
            updatedChat.unreadCount = 0;
          }
        } catch (error) {
          console.error(`Failed to mark messages as seen for chat ${chatSelected.id}:`, error);
        }
      }

      updateOrAddChat(updatedChat);
      break;
    }

    default:
      console.warn(`Unhandled notification type: ${notification.type}`);
  }
};

export const handleNotificationForOtherChats = (
  notification: Notification,
  chats: ChatResponse[],
  chatSelected: ChatResponse | null,
  updateOrAddChat: (chatToUpdate: ChatResponse) => void
) => {
  if (!chats.length) return;

  const isSeen = notification.type === NotificationType.SEEN;
  const isImage = notification.type === NotificationType.IMAGE;

  const targetChat = chats.find((c) => c.id === notification.chatId);

  if (targetChat && !isSeen) {
    // Copiar el chat y modificar la copia
    const updatedChat: ChatResponse = {
      ...targetChat,
      lastMessage: isImage ? 'Attachment' : notification.content,
      lastMessageTime: new Date().toISOString(),
      unreadCount:
        chatSelected?.id === notification.chatId
          ? 0
          : (targetChat.unreadCount || 0) + 1,
    };

    updateOrAddChat(updatedChat);
  } else if (notification.type === NotificationType.MESSAGE) {
    const newChat: ChatResponse = {
      id: notification.chatId,
      name: notification.chatName,
      senderId: notification.senderId,
      receiverId: notification.receiverId,
      lastMessage: notification.content,
      lastMessageTime: new Date().toISOString(),
      unreadCount: 1,
      recipientOnline: true,
    };
    updateOrAddChat(newChat);
  }
};