import axiosInstance from "../../auth/axios/axiosInstance.ts";
import {ChatResponse} from "../types/ChatResponse.ts";

export const createChat = async (senderId: string, recipientId: string) => {
  try {
    const response = await axiosInstance.post("/chat", {
      senderId,
      recipientId,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating chat:", error);
    throw error;
  }
}

export const getChatsByReceiver = async (): Promise<ChatResponse[]> => {
  try {
    const response = await axiosInstance.get("/chats");
    return response.data;
  } catch (error) {
    console.error("Error getting chats:", error);
    throw error;
  }
}