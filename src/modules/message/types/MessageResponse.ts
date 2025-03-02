export interface MessageResponse {
  id?: number;
  content: string;
  type: MessageType;
  state: MessageState;
  senderId: string;
  receiverId: string;
  createdAt: string;
  media?: Array<string>;
}

export enum MessageType {
  TEXT = "TEXT",
  IMAGE = "IMAGE",
  VIDEO = "VIDEO",
  AUDIO = "AUDIO",
  FILE = "FILE"
}

export enum MessageState {
  SENT = "SENT",
  SEEN = "SEEN",
}