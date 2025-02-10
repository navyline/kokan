"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getUserChats, getMessages, sendMessage } from "./actions";
import { useUser } from "@clerk/nextjs";

// ประเภทข้อมูลสำหรับห้องแชท (สำหรับ Sidebar)
// หมายเหตุ: ใน messages เราไม่รวม sender เพราะใน Sidebar เราใช้แค่ข้อความล่าสุด
type Chat = {
  id: string;
  creatorId: string;
  receiverId: string;
  messages: {
    id: string;
    chatId: string;
    senderId: string;
    content: string;
    isRead: boolean;
    createdAt: string; // หลังจากแปลงจาก Date เป็น string
  }[];
  creator: { id: string; userName: string; profileImage?: string | null };
  receiver: { id: string; userName: string; profileImage?: string | null };
};

// ประเภทข้อมูลสำหรับข้อความในห้องสนทนา (Conversation)
// ในส่วนนี้ messages จะมี sender info
type Message = {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender: { userName: string; profileImage?: string | null };
};

export default function ChatsPage() {
  const { user } = useUser();
  // ใช้ property imageUrl จาก Clerk (หรือ fallback เป็น default-avatar)
  const currentUserId = user?.id;
  const currentUserProfileImage = user?.imageUrl || "/default-avatar.png";

  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  // ดึงรายการห้องแชทเมื่อ component mount
  useEffect(() => {
    async function fetchChats() {
      const data = await getUserChats();
      // กำหนด type สำหรับข้อมูล raw เพื่อไม่ใช้ any
      type RawMessage = {
        id: string;
        chatId: string;
        senderId: string;
        content: string;
        isRead: boolean;
        createdAt: Date;
      };
      type RawChat = {
        id: string;
        creatorId: string;
        receiverId: string;
        messages: RawMessage[];
        creator: { id: string; userName: string; profileImage?: string | null };
        receiver: { id: string; userName: string; profileImage?: string | null };
      };
      const transformed = data.map((chat: RawChat) => ({
        ...chat,
        messages: chat.messages.map((msg: RawMessage) => ({
          ...msg,
          createdAt: new Date(msg.createdAt).toISOString(),
        })),
      }));
      setChats(transformed);
    }
    fetchChats();
  }, []);

  // เมื่อเลือกห้องแชท ให้ดึงข้อความของห้องนั้นมาแสดง พร้อมแปลง createdAt เป็น string
  async function selectChat(chatId: string) {
    setSelectedChat(chatId);
    const data = await getMessages(chatId);
    type RawMessage = {
      id: string;
      chatId: string;
      senderId: string;
      content: string;
      isRead: boolean;
      createdAt: Date;
      sender: { userName: string; profileImage?: string | null };
    };
    const transformed = data.map((msg: RawMessage) => ({
      id: msg.id,
      content: msg.content,
      senderId: msg.senderId,
      createdAt: new Date(msg.createdAt).toISOString(),
      sender: msg.sender,
    }));
    setMessages(transformed);
  }

  // ส่งข้อความใหม่และอัปเดตรายการข้อความใน UI
  async function handleSendMessage() {
    if (!newMessage.trim() || !selectedChat) return;
    await sendMessage(selectedChat, newMessage);
    const newMsg: Message = {
      id: Date.now().toString(), // สร้าง id ชั่วคราว
      content: newMessage,
      senderId: currentUserId || "",
      createdAt: new Date().toISOString(),
      sender: { userName: user?.fullName || "You", profileImage: currentUserProfileImage },
    };
    setMessages((prev) => [...prev, newMsg]);
    setNewMessage("");
  }

  // คำนวณผู้ใช้อีกฝ่ายในห้องแชท (สำหรับ Sidebar)
  function getOtherUser(chat: Chat) {
    if (!currentUserId) return chat.creator;
    return chat.creator.id === currentUserId ? chat.receiver : chat.creator;
  }

  // ฟังก์ชันสำหรับกลับไปยังรายการแชท (สำหรับมือถือ)
  function handleBack() {
    setSelectedChat(null);
    setMessages([]);
  }

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Sidebar: รายการห้องแชท */}
      <div className={`md:w-1/3 border-r overflow-y-auto ${selectedChat ? "hidden md:block" : "block"}`}>
        <h2 className="text-xl font-bold p-4 border-b">Chats</h2>
        {chats.map((chat) => {
          const otherUser = getOtherUser(chat);
          return (
            <div
              key={chat.id}
              className="p-4 border-b cursor-pointer hover:bg-gray-100 flex items-center"
              onClick={() => selectChat(chat.id)}
            >
              <Image
                src={otherUser.profileImage || "/default-avatar.png"}
                alt={otherUser.userName}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-semibold">{otherUser.userName}</p>
                <p className="text-sm text-gray-500">
                  {chat.messages[0]?.content || "No messages yet"}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ส่วนของแชทคอนเวอร์เซชัน */}
      <div className="md:w-2/3 flex flex-col w-full">
        {selectedChat ? (
          <>
            <div className="p-4 border-b bg-gray-100 flex items-center md:justify-between">
              {/* ปุ่ม Back สำหรับมือถือ */}
              <button onClick={handleBack} className="mr-4 md:hidden text-blue-500">
                ← Back
              </button>
              <h2 className="text-xl font-bold">Conversation</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => {
                const isCurrentUser = String(msg.senderId) === String(currentUserId);
                return (
                  <div
                    key={index}
                    className={`flex items-center space-x-2 ${
                      isCurrentUser ? "justify-end flex-row-reverse" : "justify-start"
                    }`}
                  >
                    <Image
                      src={
                        isCurrentUser
                          ? currentUserProfileImage
                          : msg.sender.profileImage || "/default-avatar.png"
                      }
                      alt={isCurrentUser ? (user?.fullName || "You") : msg.sender.userName}
                      width={40}
                      height={40}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex flex-col">
                      <div
                        className={`inline-block p-3 rounded-lg ${
                          isCurrentUser
                            ? "bg-blue-500 text-white text-right"
                            : "bg-gray-200 text-gray-900 text-left"
                        }`}
                      >
                        <p>{msg.content}</p>
                      </div>
                      <span className={`text-xs mt-1 ${isCurrentUser ? "text-right" : "text-left"} text-gray-600`}>
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="p-4 border-t flex">
              <input
                type="text"
                className="border rounded p-2 flex-1"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <button
                className="bg-blue-500 text-white px-4 ml-2 rounded"
                onClick={handleSendMessage}
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
