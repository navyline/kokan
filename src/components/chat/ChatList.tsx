"use client";

import { useEffect, useState } from "react";
import { fetchUserChats } from "@/app/chat/actions";

interface User {
  firstName: string;
  lastName: string;
}

interface Message {
  content: string;
}

interface Chat {
  id: string;
  creatorId: string;
  creator: User;
  receiver: User;
  messages?: Message[];
}

interface ChatListProps {
  currentUserId: string;
  onSelectChat: (chatId: string) => void; // ✅ เพิ่ม prop เพื่อให้เลือกแชท
}

export default function ChatList({ currentUserId, onSelectChat }: ChatListProps) {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    async function loadChats() {
      const data = await fetchUserChats();
      setChats(data);
    }

    loadChats();
  }, []);

  return (
    <div className="w-1/4 bg-gray-100 p-4 h-screen overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">แชทของคุณ</h2>
      {chats.length === 0 ? (
        <p className="text-gray-500">ไม่มีแชท</p>
      ) : (
        <ul>
          {chats.map((chat) => {
            const otherUser =
              chat.creatorId === currentUserId ? chat.receiver : chat.creator;

            return (
              <li
                key={chat.id}
                className="p-3 hover:bg-gray-200 cursor-pointer rounded-lg"
                onClick={() => onSelectChat(chat.id)} // ✅ ใช้ onSelectChat แทนการ push
              >
                <h3 className="font-semibold">{otherUser?.firstName} {otherUser?.lastName}</h3>
                <p className="text-gray-500 text-sm">
                  {chat.messages?.[0]?.content || "ไม่มีข้อความ"}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
