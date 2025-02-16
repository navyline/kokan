"use server";

import db from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";

/**
 * ดึงข้อมูลโปรไฟล์จากฐานข้อมูล
 * รวมถึง posts, followers, following, และ verification
 */
export async function getProfileById(id: string) {
  // สำคัญ: เพิ่ม verification: true เพื่อดึงข้อมูลสถานะยืนยันตัวตน
  return await db.profile.findUnique({
    where: { id },
    include: {
      verification: true, // ← ดึง verification ด้วย
      posts: {
        include: {
          favorites: true,
          comments: true,
        },
      },
      followers: true,
      following: true,
    },
  });
}

/**
 * กด Follow ผู้ใช้งาน
 */
export async function followUser(currentUserProfileId: string, targetProfileId: string) {
  const existing = await db.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUserProfileId,
        followingId: targetProfileId,
      },
    },
  });

  if (!existing) {
    await db.follow.create({
      data: {
        followerId: currentUserProfileId,
        followingId: targetProfileId,
      },
    });
  }

  return true;
}

/**
 * ยกเลิก Follow (Unfollow)
 */
export async function unfollowUser(currentUserProfileId: string, targetProfileId: string) {
  await db.follow.delete({
    where: {
      followerId_followingId: {
        followerId: currentUserProfileId,
        followingId: targetProfileId,
      },
    },
  });

  return true;
}


/**
 * ฟังก์ชันสร้างแชทระหว่างผู้ใช้
 * หากมีแชทอยู่แล้วจะส่ง URL ของแชทนั้นกลับ
 */
export const startChat = async (receiverId: string) => {
  "use server";

  const user = await currentUser();
  if (!user) {
    console.error("❌ User not logged in");
    return null;
  }

  // ดึงข้อมูลโปรไฟล์ของผู้ใช้ปัจจุบันจากฐานข้อมูล
  const senderProfile = await db.profile.findUnique({ where: { clerkId: user.id } });
  if (!senderProfile) {
    console.error("❌ Sender profile not found");
    return null;
  }

  // ห้ามให้ผู้ใช้แชทกับตัวเอง
  if (senderProfile.id === receiverId) {
    console.error("❌ Cannot chat with yourself");
    return null;
  }

  try {
    // ตรวจสอบว่ามีแชทอยู่แล้วหรือไม่
    let chat = await db.chat.findFirst({
      where: {
        OR: [
          { creatorId: senderProfile.id, receiverId },
          { creatorId: receiverId, receiverId: senderProfile.id },
        ],
      },
    });

    // ถ้าไม่มีแชทให้สร้างใหม่
    if (!chat) {
      console.log("🛠 Creating new chat...");
      chat = await db.chat.create({
        data: {
          creatorId: senderProfile.id,
          receiverId,
          isGroup: false,
          createdAt: new Date(),
        },
      });
    }

    // ส่ง URL ของหน้าที่แสดงแชท (สมมติว่าเราใช้ dynamic route /chats)
    return `/chats`;
  } catch (error) {
    console.error("❌ Error starting chat:", error);
    return null;
  }
};
