"use server";

import db from "@/utils/db";
import { auth } from "@clerk/nextjs/server";

/**
 * ดึงรายการห้องแชททั้งหมดของผู้ใช้
 */
export async function getUserChats() {
  try {
    const { userId } = await auth();
    if (!userId) return [];

    // ดึงโปรไฟล์ของผู้ใช้จากฐานข้อมูล
    const profile = await db.profile.findUnique({
      where: { clerkId: userId },
      select: { id: true },
    });
    if (!profile) return [];

    // ดึงห้องแชทที่เกี่ยวข้องกับผู้ใช้
    return await db.chat.findMany({
      where: {
        OR: [{ creatorId: profile.id }, { receiverId: profile.id }],
      },
      include: {
        creator: { select: { id: true, userName: true, profileImage: true } },
        receiver: { select: { id: true, userName: true, profileImage: true } },
        // ดึงข้อความล่าสุด (ถ้ามี)
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Error fetching user chats:", error);
    return [];
  }
}

/**
 * ดึงข้อความทั้งหมดของห้องแชทตาม chatId
 */
export async function getMessages(chatId: string) {
  return await db.message.findMany({
    where: { chatId },
    orderBy: { createdAt: "asc" },
    include: {
      sender: { select: { id: true, userName: true, profileImage: true } },
    },
  });
}

/**
 * ส่งข้อความในแชท
 */
export async function sendMessage(chatId: string, content: string) {
  const { userId } = await auth();
  if (!userId) return null;

  // ดึงโปรไฟล์ของผู้ใช้ที่กำลังส่งข้อความ
  const senderProfile = await db.profile.findUnique({ where: { clerkId: userId } });
  if (!senderProfile) return null;

  return await db.message.create({
    data: { chatId, senderId: senderProfile.id, content },
  });
}
