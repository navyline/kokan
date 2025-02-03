"use server";

import db from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";

/**
 * ดึงห้องแชททั้งหมดของ User
 */
export async function getUserChats() {
  const user = await currentUser();
  if (!user) return [];

  // ดึงโปรไฟล์จากฐานข้อมูล
  const profile = await db.profile.findUnique({
    where: { clerkId: user.id },
    select: { id: true },
  });
  if (!profile) return [];

  // ดึงห้องแชทที่เกี่ยวข้องกับ User
  return await db.chat.findMany({
    where: {
      OR: [{ creatorId: profile.id }, { receiverId: profile.id }],
    },
    include: {
      creator: { select: { id: true, userName: true, profileImage: true } },
      receiver: { select: { id: true, userName: true, profileImage: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * ดึงข้อความทั้งหมดของห้องแชท
 */
export async function getMessages(chatId: string) {
  return await db.message.findMany({
    where: { chatId },
    orderBy: { createdAt: "asc" },
    include: { sender: { select: { id: true, userName: true, profileImage: true } } },
  });
}

/**
 * ส่งข้อความในแชท
 */
export async function sendMessage(chatId: string, content: string) {
  "use server";
  const user = await currentUser();
  if (!user) return null;

  // ดึงโปรไฟล์ของผู้ใช้ปัจจุบัน
  const senderProfile = await db.profile.findUnique({ where: { clerkId: user.id } });
  if (!senderProfile) return null;

  // บันทึกข้อความลงฐานข้อมูล
  return await db.message.create({
    data: { chatId, senderId: senderProfile.id, content },
  });
}
