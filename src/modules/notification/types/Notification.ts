import { MessageType } from '../../message/types/MessageResponse';

export interface Notification {
  chatId: string;
  content: string;
  senderId: string;
  receiverId: string;
  messageType: MessageType;
  type: NotificationType;
  chatName: string;
  media?: Array<string>;
}

export enum NotificationType {
  SEEN = 'SEEN',
  MESSAGE = 'MESSAGE',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO'
}
