import axiosInstance from "@/modules/auth/axios/axiosInstance";
import { MessageResponse } from "../types/MessageResponse";
import { MessageRequest } from "../types/MessageRequest";

export const getMessages = async (chatId: string): Promise<MessageResponse[]> => {
  try {
    const response = await axiosInstance.get(`/messages/chat/${chatId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting messages:", error);
    throw error;
  }
}

export const setMessagesToSeen = async (chatId: string): Promise<Response> => {
  try {
    return await axiosInstance.patch(`/messages`, null, {
      params: {
        "chat-id": chatId,
      }
    });
  } catch (error) {
    console.error("Error setting messages to seen:", error);
    throw error;
  }
}

export const saveMessage = async (message: MessageRequest): Promise<Response> => {
  try {
    return await axiosInstance.post(`/messages`, message);
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
}

export const uploadMediaMessage = async (chatId: string, file: File): Promise<void> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    await axiosInstance.post(`/messages/upload-media`, formData, {
      params: {
        'chat-id': chatId
      },
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  } catch (error) {
    console.error("Error uploading media message:", error);
    throw error;
  }
}