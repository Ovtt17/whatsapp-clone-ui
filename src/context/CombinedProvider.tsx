import { FC, ReactNode } from 'react';
import { ChatProvider } from "../modules/chat/context/ChatContext.tsx";
import { ContactProvider } from "../modules/user/context/ContactContext.tsx";
import { MessageProvider } from "../modules/message/context/MessageContext.tsx";
import { NotificationProvider } from '@/modules/notification/context/NotificationContext.tsx';

const CombinedProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <ContactProvider>
      <ChatProvider>
        <MessageProvider>
          <NotificationProvider>
            {children}
          </NotificationProvider>
        </MessageProvider>
      </ChatProvider>
    </ContactProvider>
  );
}

export default CombinedProvider;