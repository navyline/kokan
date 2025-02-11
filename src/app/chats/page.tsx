"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import {
  getUserChats,
  getMessages,
  sendMessage,
} from "./actions"; // <- import Server Actions ฝั่งเดียวกัน
import { Chat, Message } from "@/utils/types"; // ลบการ import 'Profile' ออก เพราะไม่ได้ใช้งาน

// สร้าง types สำหรับข้อมูลที่มาจากเซิร์ฟเวอร์ เพื่อหลีกเลี่ยงการใช้ explicit any
interface ServerMessage extends Omit<Message, "createdAt"> {
  createdAt: string | Date;
}

interface ServerChat extends Omit<Chat, "createdAt" | "messages"> {
  createdAt: string | Date;
  messages?: ServerMessage[];
}

export default function ChatPage() {
  const { user } = useUser();
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);

  // สำหรับเทียบว่าใครเป็นเรา (โดยใช้ profileId ของเรา)
  const [myProfileId, setMyProfileId] = useState<string | null>(null);

  // ดึง chats และแปลง createdAt ให้เป็น string (ISO) ถ้าจำเป็น
  useEffect(() => {
    async function fetchData() {
      // 1) ดึงรายการ Chats
      const userChats = (await getUserChats()) as ServerChat[];

      // แปลง createdAt ในแต่ละ chat (และใน messages ภายใน chat) ให้เป็น ISO string
      const transformedChats = userChats.map((chat: ServerChat): Chat => ({
        ...chat,
        createdAt:
          typeof chat.createdAt === "string"
            ? chat.createdAt
            : new Date(chat.createdAt).toISOString(),
        messages: (chat.messages ?? []).map((msg: ServerMessage): Message => ({
          ...msg,
          createdAt:
            typeof msg.createdAt === "string"
              ? msg.createdAt
              : new Date(msg.createdAt).toISOString(),
        })),
      }));

      setChats(transformedChats);

      // กำหนด myProfileId โดยดูจาก chat ตัวแรกที่มีข้อมูล (ขึ้นอยู่กับวิธีที่คุณต้องการใช้งาน)
      if (transformedChats.length > 0 && user) {
        const anyChat = transformedChats[0];
        if (anyChat.creator?.clerkId === user.id) {
          setMyProfileId(anyChat.creator.id);
        } else if (anyChat.receiver?.clerkId === user.id) {
          setMyProfileId(anyChat.receiver.id);
        }
      }
    }
    fetchData();
  }, [user]);

  // เมื่อเลือก chat แล้ว ให้โหลดข้อความ
  useEffect(() => {
    async function loadMessages() {
      if (!selectedChat) return;
      setLoadingMessages(true);
      const msgs = (await getMessages(selectedChat.id)) as ServerMessage[];
      const transformedMsgs = msgs.map((msg: ServerMessage): Message => ({
        ...msg,
        createdAt:
          typeof msg.createdAt === "string"
            ? msg.createdAt
            : new Date(msg.createdAt).toISOString(),
      }));
      setMessages(transformedMsgs);
      setLoadingMessages(false);
    }
    loadMessages();
  }, [selectedChat]);

  // ฟังก์ชันเลือกแชท
  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
  };

  // ฟังก์ชันส่งข้อความ
  const handleSendMessage = async () => {
    if (!selectedChat || !messageText.trim()) return;
    await sendMessage(selectedChat.id, messageText.trim());
    setMessageText("");

    // โหลดข้อความใหม่หลังส่ง หรือจะ push เข้า state ก็ได้
    const msgs = (await getMessages(selectedChat.id)) as ServerMessage[];
    const transformedMsgs = msgs.map((msg: ServerMessage): Message => ({
      ...msg,
      createdAt:
        typeof msg.createdAt === "string"
          ? msg.createdAt
          : new Date(msg.createdAt).toISOString(),
    }));
    setMessages(transformedMsgs);
  };

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Sidebar (ด้านซ้าย) */}
      <div className="w-1/4 border-r border-gray-200 p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Chats</h2>
        {chats.map((chat) => {
          // หาว่าใครเป็นผู้สร้าง และอีกฝ่ายเป็นใคร
          const isCreatorMe = chat.creatorId === myProfileId;
          const otherUser = isCreatorMe ? chat.receiver : chat.creator;
          const lastMessage = chat.messages?.[0];

          return (
            <div
              key={chat.id}
              onClick={() => handleSelectChat(chat)}
              className={`flex items-center p-2 mb-2 rounded cursor-pointer hover:bg-gray-100 transition ${
                selectedChat?.id === chat.id ? "bg-gray-100" : ""
              }`}
            >
              <Image
                src={otherUser?.profileImage ?? "/default-profile.png"}
                alt={otherUser?.userName || "User"}
                width={40}
                height={40}
                className="rounded-full border border-gray-300 object-cover"
              />
              <div className="ml-3">
                <p className="font-medium text-gray-700">
                  {otherUser?.userName || "Unnamed"}
                </p>
                <p className="text-sm text-gray-500 truncate max-w-[180px]">
                  {lastMessage?.content || ""}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Chat Area (ด้านขวา) */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="px-4 py-2 border-b border-gray-200">
          <h2 className="text-lg font-semibold">
            {selectedChat
              ? "Conversation"
              : "Select a chat to start conversation"}
          </h2>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
          {loadingMessages ? (
            <p className="text-gray-500">Loading messages...</p>
          ) : !selectedChat ? (
            <p className="text-gray-500">No chat selected.</p>
          ) : (
            messages.map((msg) => {
              const isMe = msg.senderId === myProfileId;
              return (
                <div
                  key={msg.id}
                  className={`mb-2 flex items-end ${
                    isMe ? "justify-end" : "justify-start"
                  }`}
                >
                  {/* ถ้าไม่ใช่เรา ให้แสดงรูปโปรไฟล์ด้านซ้าย */}
                  {!isMe && (
                    <Image
                      src={msg.sender?.profileImage || "/default-profile.png"}
                      alt={msg.sender?.userName || "User"}
                      width={32}
                      height={32}
                      className="rounded-full border border-gray-300 mr-2"
                    />
                  )}

                  {/* ข้อความ (Bubble) */}
                  <div
                    className={`max-w-xs px-3 py-2 rounded-lg shadow ${
                      isMe
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    <p className="text-sm mb-1">{msg.content}</p>
                    <span className="text-xs opacity-70">
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </span>
                  </div>

                  {/* ถ้าเป็นข้อความของเรา ให้แสดงรูปโปรไฟล์ด้านขวา */}
                  {isMe && (
                    <Image
                      src={msg.sender?.profileImage || "/default-profile.png"}
                      alt={msg.sender?.userName || "Me"}
                      width={32}
                      height={32}
                      className="rounded-full border border-gray-300 ml-2"
                    />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Input Area */}
        {selectedChat && (
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center gap-2">
              <input
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none"
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
