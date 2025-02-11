"use server";

import db from "@/utils/db";
import { auth } from "@clerk/nextjs/server";

/**
 * ดึงรายการ Notification ของ user ปัจจุบัน
 */
export async function getNotifications() {
  // ใช้ Clerk auth() เพื่อตรวจสอบ user ปัจจุบัน
  const { userId } = await auth();
  if (!userId) return [];

  // หา profileId ของ user
  const profile = await db.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  if (!profile) return [];

  // ดึงรายการ Notification ที่ receiverId == profile.id
  const notifications = await db.notification.findMany({
    where: { receiverId: profile.id },
    orderBy: { createdAt: "desc" },
  });

  return notifications;
}

/**
 * สร้าง Notification ใหม่ (สำหรับสถานการณ์ที่ต้องการสร้างแจ้งเตือน)
 */
export async function createNotification(receiverProfileId: string, message: string) {
  return db.notification.create({
    data: {
      receiverId: receiverProfileId,
      message,
    },
  });
}

/**
 * Mark Notification ว่าอ่านแล้ว (isRead = true)
 */
export async function markNotificationAsRead(notificationId: string) {
  try {
    await db.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
    return true;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return false;
  }
}

/**
 * Mark ทุก Notification ของ user ปัจจุบันว่าอ่านแล้ว
 */
export async function markAllNotificationsAsRead() {
  const { userId } = await auth();
  if (!userId) return false;

  const profile = await db.profile.findUnique({
    where: { clerkId: userId },
    select: { id: true },
  });
  if (!profile) return false;

  try {
    await db.notification.updateMany({
      where: {
        receiverId: profile.id,
        isRead: false,
      },
      data: { isRead: true },
    });
    return true;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return false;
  }
}
