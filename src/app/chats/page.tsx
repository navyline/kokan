"use client";

import { useState, useEffect } from "react";
import { getUserChats, getMessages, sendMessage } from "./actions";
import Image from "next/image";

type Chat = {
  id: string;
  creatorId: string;
  receiverId: string;
  messages: { content: string }[];
  creator: { userName: string; profileImage?: string | null };
  receiver: { userName: string; profileImage?: string | null };
};

type Message = {
  content: string;
  senderId: string;
  createdAt: Date;
};

export default function ChatsPage() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    async function fetchChats() {
      const data = await getUserChats();
      setChats(data);
    }
    fetchChats();
  }, []);

  async function selectChat(chatId: string) {
    setSelectedChat(chatId);
    const data = await getMessages(chatId);
    setMessages(data);
  }

  async function handleSendMessage() {
    if (!newMessage.trim() || !selectedChat) return;
    await sendMessage(selectedChat, newMessage);
    setMessages([...messages, { content: newMessage, senderId: "คุณ", createdAt: new Date() }]);
    setNewMessage("");
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar รายการแชท */}
      <div className="w-1/3 border-r overflow-y-auto">
        <h2 className="text-lg font-bold p-4">Chats</h2>
        {chats.map((chat) => {
          const otherUser = chat.creatorId === chat.receiverId ? chat.receiver : chat.creator;
          return (
            <div
              key={chat.id}
              className="p-4 border-b cursor-pointer hover:bg-gray-100"
              onClick={() => selectChat(chat.id)}
            >
              <div className="flex items-center">
                <Image
                  src={otherUser.profileImage || "/default-avatar.png"}
                  alt={otherUser.userName}
                  width={40}  
                  height={40} 
                  className="w-10 h-10 rounded-full mr-3"
                />                <div>
                  <p className="font-semibold">{otherUser.userName}</p>
                  <p className="text-sm text-gray-500">{chat.messages[0]?.content || "No messages yet"}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ส่วนของข้อความแชท */}
      <div className="w-2/3 flex flex-col">
        {selectedChat ? (
          <>
            <div className="p-4 border-b bg-gray-100">
              <h2 className="text-lg font-bold">Chat</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((msg, index) => (
                <div key={index} className={`p-2 my-2 rounded ${msg.senderId === "คุณ" ? "bg-blue-200 self-end" : "bg-gray-200"}`}>
                  <p className="text-sm">{msg.content}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t flex">
              <input
                type="text"
                className="border p-2 flex-1"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button className="bg-blue-500 text-white px-4 ml-2" onClick={handleSendMessage}>
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">Select a chat to start messaging</div>
        )}
      </div>
    </div>
  );
}
