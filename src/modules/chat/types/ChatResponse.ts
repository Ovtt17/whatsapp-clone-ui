export type ChatResponse = {
  id: string;
  name: string;
  unreadCount: number;
  lastMessage: string;
  lastMessageTime: Date;
  isRecipientOnline: boolean;
  senderId: string;
  recipientId: string;
}