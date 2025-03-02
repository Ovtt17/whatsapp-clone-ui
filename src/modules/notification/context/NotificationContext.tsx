import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
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
  const { chats, updateOrAddChat, chatSelected, setChatSelected } = useChatContext();
  const { setChatMessages } = useMessageContext();

  const [socketClient, setSocketClient] = useState<Stomp.Client | null>(null);
  const [subscription, setSubscription] = useState<Stomp.Subscription | null>(null);

  const handleNotification = (notification: Notification) => {
    if (!notification) return;

    if (chatSelected && chatSelected.id === notification.chatId) {
      handleNotificationForSelectedChat(notification, chatSelected, setChatSelected, setChatMessages);
    } else {
      handleNotificationForOtherChats(notification, chats, updateOrAddChat);
    }
  };

  useEffect(() => {
    if (!keycloakService.keycloak.tokenParsed?.sub) return;

    const ws = new SockJS(`${import.meta.env.VITE_API_ROOT_URL}/ws`);
    const client = Stomp.over(ws);
    const subUrl = `/user/${keycloakService.keycloak.tokenParsed?.sub}/chat`;

    client.connect(
      { Authorization: `Bearer ${keycloakService.token}` },
      () => {
        const subscription = client.subscribe(
          subUrl,
          (message: any) => {
            const notification: Notification = JSON.parse(message.body);
            handleNotification(notification);
          },
          () => console.error('Error while connecting to WebSocket')
        );
        setSubscription(subscription);

        setSocketClient(client);
      }
    );

    return () => {
      if (socketClient && subscription) {
        socketClient.disconnect(() => {
          console.log('WebSocket disconnected');
        });
        subscription.unsubscribe();
        setSocketClient(null);
        setSubscription(null);
      }
    };
  }, [keycloakService.keycloak.tokenParsed?.sub, chats.length]);

  return (
    <NotificationContext.Provider value={{ socketClient }}>
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