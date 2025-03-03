export type ChatResponse = {
  id: string;
  name: string;
  unreadCount?: number;
  lastMessage?: string;
  lastMessageTime: string;
  recipientOnline: boolean;
  senderId: string;
  receiverId: string;
}