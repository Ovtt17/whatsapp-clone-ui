import {FC, useEffect, useState} from 'react';
import {ChatResponse} from "../../types/ChatResponse.ts";
import {getChatsByReceiver} from "../../services/chatService.ts";

const ChatList: FC = () => {
  const [chats, setChats] = useState<ChatResponse[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      const allChats = await getChatsByReceiver();
      setChats(allChats);
      console.log(allChats);
    }
    fetchChats();
  }, []);

  return (
    <>
      {chats.map((chat) => (
        <div key={chat.id} className="flex items-center gap-2 p-2 cursor-pointer">
          <img src={chat.senderId} alt={chat.name} className="h-8 w-8 rounded-full"/>
          <div>
            <p>{chat.lastMessage}</p>
          </div>
        </div>
      ))}
    </>
  );
}

export default ChatList;