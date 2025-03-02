import { Notification, NotificationType } from '../types/Notification';
import { MessageResponse, MessageState, MessageType } from '@/modules/message/types/MessageResponse';
import { ChatResponse } from '@/modules/chat/types/ChatResponse';
import { Dispatch, SetStateAction } from 'react';

export const handleNotificationForSelectedChat = (
  notification: Notification,
  chatSelected: ChatResponse | null,
  setChatSelected: Dispatch<SetStateAction<ChatResponse | null>>,
  setChatMessages: Dispatch<SetStateAction<MessageResponse[]>>
) => {
  if (!chatSelected || chatSelected.id !== notification.chatId) return;

  switch (notification.type) {
    case NotificationType.MESSAGE:
    case NotificationType.IMAGE:
      const message: MessageResponse = {
        senderId: notification.senderId,
        receiverId: notification.receiverId,
        content: notification.content,
        type: notification.messageType,
        media: notification.media,
        state: MessageState.SENT,
        createdAt: new Date().toISOString(),
      };

      setChatSelected({
        ...chatSelected,
        lastMessage: notification.messageType === MessageType.IMAGE ? 'Attachment' : message.content,
      });

      setChatMessages((prevMessages) => [...prevMessages, message]);
      break;

    case NotificationType.SEEN:
      setChatMessages((prevMessages) =>
        prevMessages.map((message) => ({ ...message, state: MessageState.SEEN }))
      );
      break;
  }
};

export const handleNotificationForOtherChats = (
  notification: Notification,
  chats: ChatResponse[],
  updateOrAddChat: (chatToUpdate: ChatResponse) => void
) => {
  if (!chats.length) return;
  const targetChat = chats.find((c) => c.id === notification.chatId);
  if (targetChat && notification.type !== NotificationType.SEEN) {
    targetChat.lastMessage = notification.type === NotificationType.IMAGE ? 'Attachment' : notification.content;
    targetChat.lastMessageTime = new Date().toISOString();
    targetChat.unreadCount = (targetChat.unreadCount || 0) + 1;
    updateOrAddChat(targetChat);
  } else if (notification.type === NotificationType.MESSAGE) {
    const newChat: ChatResponse = {
      id: notification.chatId,
      name: notification.chatName,
      senderId: notification.senderId,
      receiverId: notification.receiverId,
      lastMessage: notification.content,
      lastMessageTime: new Date().toISOString(),
      unreadCount: 1,
      isRecipientOnline: true,
    };
    updateOrAddChat(newChat);
  }
};