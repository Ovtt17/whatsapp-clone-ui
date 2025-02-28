import axiosInstance from "@/modules/auth/axios/axiosInstance";
import { UserResponse } from "../UserResponse";

export async function getAllUsers(): Promise<UserResponse[]> {
  try {
    const response = await axiosInstance.get("/users");
    return response.data;
  } catch (error) {
    console.error("Error getting users:", error);
    throw error;
  }
}