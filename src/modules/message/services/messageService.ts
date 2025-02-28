import axiosInstance from "@/modules/auth/axios/axiosInstance";
import { MessageResponse } from "../types/MessageResponse";

export const getMessages = async (chatId: string): Promise<MessageResponse[]> => {
  try {
    const response = await axiosInstance.get(`/messages/${chatId}/messages`);
    return response.data;
  } catch (error) {
    console.error("Error getting messages:", error);
    throw error;
  }
}