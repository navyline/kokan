// app/actions/chatActions.ts
'use server';

import db from "@/utils/db";
import { revalidatePath } from 'next/cache'; // ถ้าต้องการ revalidate

// 1) สร้างห้องแชท (ถ้ายังไม่มี)
export async function createChat(creatorId: string, receiverId: string) {
  // เช็คว่ามี chat อยู่แล้วหรือยัง
  const existingChat = await db.chat.findFirst({
    where: {
      OR: [
        { creatorId, receiverId },
        { creatorId: receiverId, receiverId: creatorId },
      ],
    },
  });
  if (existingChat) {
    return existingChat;
  }

  const newChat = await db.chat.create({
    data: {
      creatorId,
      receiverId,
    },
  });

  // หากต้องการ revalidate หน้าไหนก็สามารถทำได้
  // revalidatePath('/some/path');

  return newChat;
}

// 2) ดึง Chat ทั้งหมดของผู้ใช้
export async function fetchUserChats(userId: string) {
  const chats = await db.chat.findMany({
    where: {
      OR: [
        { creatorId: userId },
        { receiverId: userId },
      ],
    },
    include: {
      messages: {
        orderBy: { createdAt: 'desc' },
        take: 1, // ตัวอย่าง: เอาข้อความล่าสุด 1 ข้อ
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return chats;
}

// 3) ดึงข้อความภายใน Chat หนึ่ง ๆ
export async function fetchMessages(chatId: string) {
  const messages = await db.message.findMany({
    where: { chatId },
    orderBy: { createdAt: 'asc' },
  });
  return messages;
}

// 4) ส่งข้อความ
export async function sendMessage(chatId: string, senderId: string, content: string) {
  const msg = await db.message.create({
    data: {
      chatId,
      senderId,
      content,
    },
  });

  // สมมติว่าถ้ามีการส่งข้อความแล้ว อยาก revalidate หน้าช่องแชท
  revalidatePath(`/chat/${chatId}`);

  return msg;
}
