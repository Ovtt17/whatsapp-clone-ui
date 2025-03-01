import { MessageType } from "./MessageResponse";

export interface MessageRequest {
  chatId: string;
  content: string;
  senderId: string;
  receiverId: string;
  type: MessageType;
}