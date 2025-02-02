// components/chat/StartChatButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startChat } from "@/app/profile/[id]/actions"; // ปรับ path ตามโครงสร้างโปรเจ็กต์ของคุณ
import { MessageCircle } from "lucide-react";

export default function StartChatButton({ receiverId }: { receiverId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleStartChat = async () => {
    setLoading(true);
    // เรียก Server Action startChat โดยส่ง receiverId
    const chatUrl = await startChat(receiverId);
    setLoading(false);

    if (chatUrl) {
      // เปลี่ยนเส้นทางไปยังหน้ารายละเอียดแชท
      router.push(chatUrl);
    } else {
      alert("❌ Failed to start chat. Please try again.");
    }
  };

  return (
    <button
      onClick={handleStartChat}
      disabled={loading}
      className="px-4 py-2 bg-green-500 text-white rounded flex items-center gap-2 cursor-pointer hover:bg-green-600 transition disabled:bg-gray-400"
    >
      <MessageCircle size={18} /> {loading ? "Starting..." : "Start Chat"}
    </button>
  );
}
