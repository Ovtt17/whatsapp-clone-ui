export type ChatResponse = {
  id: string;
  name: string;
  unreadCount?: number;
  lastMessage?: string;
  lastMessageTime: string;
  isRecipientOnline: boolean;
  senderId: string;
  receiverId: string;
}