"use client";

import { useEffect, useState } from "react";
import { fetchChatMessages, sendMessage } from "@/app/chat/actions";

interface Message {
  id: string;
  content: string;
  senderId: string;
}

interface ChatRoomProps {
  chatId: string;
  currentUserId: string;
}

export default function ChatRoom({ chatId, currentUserId }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    async function loadMessages() {
      const data = await fetchChatMessages(chatId);
      setMessages(data);
    }

    loadMessages();
  }, [chatId]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const message = await sendMessage(chatId, newMessage);
    if (message) {
      setMessages((prev) => [...prev, message]);
      setNewMessage("");
    }
  };

  return (
    <div className="flex flex-col h-full p-4 bg-white">
      <div className="flex-1 overflow-y-auto space-y-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-2 rounded-lg max-w-xs ${
              message.senderId === currentUserId
                ? "bg-blue-500 text-white self-end"
                : "bg-gray-200 self-start"
            }`}
          >
            <p>{message.content}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center mt-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="พิมพ์ข้อความ..."
          className="flex-1 p-2 border rounded-lg"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg"
        >
          ส่ง
        </button>
      </div>
    </div>
  );
}
