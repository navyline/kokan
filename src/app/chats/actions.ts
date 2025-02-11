"use server";

import db from "@/utils/db";
import { auth } from "@clerk/nextjs/server";

/**
 * ดึงรายการห้องแชททั้งหมดของผู้ใช้
 */
export async function getUserChats() {
  const { userId } = await auth();
  if (!userId) return [];

  // ดึง profileId ของ user
  const profile = await db.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  if (!profile) return [];

  const chats = await db.chat.findMany({
    where: {
      OR: [{ creatorId: profile.id }, { receiverId: profile.id }],
    },
    include: {
      creator: {
        select: { id: true, userName: true, profileImage: true, clerkId: true },
      },
      receiver: {
        select: { id: true, userName: true, profileImage: true, clerkId: true },
      },
      // สมมติว่าเราดึงข้อความล่าสุด 1 ข้อความ
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });
  return chats;
}

/**
 * ดึงข้อความทั้งหมดของห้องแชทตาม chatId
 */
export async function getMessages(chatId: string) {
  return await db.message.findMany({
    where: { chatId },
    orderBy: { createdAt: "asc" },
    include: {
      sender: {
        select: { id: true, userName: true, profileImage: true },
      },
    },
  });
}

/**
 * ส่งข้อความในแชท
 */
export async function sendMessage(chatId: string, content: string) {
  const { userId } = await auth();
  if (!userId) return null;

  // หา profileId ของผู้ส่ง
  const senderProfile = await db.profile.findUnique({
    where: { clerkId: userId },
  });
  if (!senderProfile) return null;

  return await db.message.create({
    data: {
      chatId,
      senderId: senderProfile.id,
      content,
    },
  });
}
