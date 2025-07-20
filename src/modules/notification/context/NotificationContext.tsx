import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import { useKeycloak } from '@/modules/auth/keycloak/KeycloakContext.tsx';
import { Notification } from '../types/Notification';
import { useChatContext } from '@/modules/chat/context/ChatContext';
import { useMessageContext } from '@/modules/message/context/MessageContext';
import { handleNotificationForOtherChats, handleNotificationForSelectedChat } from '../utils/notificationHandlers';

interface NotificationContextProps {
  socketClient: Stomp.Client | null;
}

const NotificationContext = createContext<NotificationContextProps | undefined>(undefined);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { keycloakService } = useKeycloak();
  const { chats, updateOrAddChat, chatSelected } = useChatContext();
  const { setChatMessages } = useMessageContext();

  const socketClientRef = useRef<Stomp.Client | null>(null);
  const [subscription, setSubscription] = useState<Stomp.Subscription | null>(null);

  const handleNotification = async (notification: Notification) => {
    if (!notification) return;

    if (keycloakService.userId && chatSelected && chatSelected.id === notification.chatId) {
      await handleNotificationForSelectedChat(
        notification,
        chatSelected,
        updateOrAddChat,
        setChatMessages,
        keycloakService.userId
      );
    } else if (keycloakService.userId) {
      handleNotificationForOtherChats(
        notification,
        chats,
        chatSelected,
        updateOrAddChat
      );
    }
  };

  useEffect(() => {
    if (!keycloakService.userId) return;

    if (!socketClientRef.current) {
      const ws = new SockJS(`${import.meta.env.VITE_API_ROOT_URL}/ws`);
      const client = Stomp.over(ws);
      const subUrl = `/user/${keycloakService.userId}/chat`;

      client.connect(
        { Authorization: `Bearer ${keycloakService.token}` },
        () => {
          console.log('WebSocket connected');
          const subscription = client.subscribe(
            subUrl,
            (message: any) => {
              const notification: Notification = JSON.parse(message.body);
              handleNotification(notification);
            },
            (error: any) => console.error('Error while subscribing to WebSocket', error)
          );
          setSubscription(subscription);
        },
        (error: any) => console.error('Error while connecting to WebSocket', error)
      );

      socketClientRef.current = client;
    }

    return () => {
      if (socketClientRef.current && subscription) {
        socketClientRef.current.disconnect(() => {
          console.log('WebSocket disconnected');
        });
        subscription.unsubscribe();
        socketClientRef.current = null;
        setSubscription(null);
      }
    };
  }, [keycloakService.userId, chatSelected, chats, updateOrAddChat, setChatMessages]);

  return (
    <NotificationContext.Provider value={{ socketClient: socketClientRef.current }}>
      {children}
    </NotificationContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};