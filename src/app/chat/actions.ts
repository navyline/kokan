"use server";

import db from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";

// ✅ ดึงรายการแชทของผู้ใช้ปัจจุบัน
export async function fetchUserChats() {
  const user = await currentUser();
  if (!user || !user.id) return [];

  try {
    const chats = await db.chat.findMany({
      where: {
        OR: [{ creatorId: user.id }, { receiverId: user.id }],
      },
      include: {
        creator: true,
        receiver: true,
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1, // ดึงข้อความล่าสุดเท่านั้น
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return chats;
  } catch (error) {
    console.error("❌ Error fetching chats:", error);
    return [];
  }
}

// ✅ ดึงข้อความของแชทที่เลือก
export async function fetchChatMessages(chatId: string) {
  try {
    const messages = await db.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
      include: {
        sender: true,
      },
    });

    return messages;
  } catch (error) {
    console.error("❌ Error fetching messages:", error);
    return [];
  }
}

// ✅ ส่งข้อความใหม่
export async function sendMessage(chatId: string, content: string) {
  const user = await currentUser();
  if (!user || !user.id) return null;

  try {
    const message = await db.message.create({
      data: {
        chatId,
        senderId: user.id,
        content,
      },
    });

    return message;
  } catch (error) {
    console.error("❌ Error sending message:", error);
    return null;
  }
}

// ✅ เริ่มแชทใหม่ (หรือเปิดแชทที่มีอยู่แล้ว)
export async function startChat(receiverId: string) {
  const user = await currentUser();
  if (!user || !user.id) return null;

  try {
    // ตรวจสอบว่ามีแชทอยู่แล้วหรือไม่
    const existingChat = await db.chat.findFirst({
      where: {
        OR: [
          { creatorId: user.id, receiverId },
          { creatorId: receiverId, receiverId: user.id },
        ],
      },
    });

    if (existingChat) return existingChat.id;

    // สร้างแชทใหม่
    const newChat = await db.chat.create({
      data: {
        creatorId: user.id,
        receiverId,
      },
    });

    return newChat.id;
  } catch (error) {
    console.error("❌ Error starting chat:", error);
    return null;
  }
}
