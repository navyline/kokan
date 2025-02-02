'use client'

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ChatList from "@/components/chat/ChatList";
import ChatRoom from "@/components/chat/ChatRoom";

export default function ChatPage() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const [activeChatId, setActiveChatId] = useState<string | null>(null); // ✅ ระบุประเภท

  if (!isSignedIn) {
    router.push("/sign-in"); // 🔥 ถ้าไม่ได้ล็อกอินให้ไปหน้า Sign-in
    return <p>กำลังโหลด...</p>;
  }

  const currentUserId = user?.id || "";

  // ✅ เพิ่มประเภทให้กับ chatId
  const handleChatSelect = (chatId: string) => {
    setActiveChatId(chatId);
  };

  return (
    <div className="flex h-screen">
      {/* ✅ เพิ่ม onSelectChat ใน ChatList */}
      <ChatList currentUserId={currentUserId} onSelectChat={handleChatSelect} />

      {/* ✅ แสดง ChatRoom เมื่อเลือกแชท */}
      <div className="flex-grow flex items-center justify-center bg-white p-4">
        {activeChatId ? (
          <ChatRoom chatId={activeChatId} currentUserId={currentUserId} />
        ) : (
          <p className="text-gray-500">เลือกแชทเพื่อเริ่มสนทนา</p>
        )}
      </div>
    </div>
  );
}
