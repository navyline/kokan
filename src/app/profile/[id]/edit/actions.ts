"use server";

import db from "@/utils/db";

/**
 * อัปเดตข้อมูลโปรไฟล์ในฐานข้อมูล
 * @param id - id ของ profile ใน DB
 * @param data - ข้อมูลใหม่สำหรับอัปเดต
 */
export async function updateProfileAction(
  id: string,
  data: {
    firstName?: string;
    lastName?: string;
    userName?: string;
    bio?: string;
  }
) {
  try {
    // ตรวจสอบว่าชื่อผู้ใช้ซ้ำหรือไม่
    if (data.userName) {
      const existingUser = await db.profile.findUnique({
        where: { userName: data.userName },
      });

      if (existingUser && existingUser.id !== id) {
        throw new Error("❌ Username นี้ถูกใช้ไปแล้ว");
      }
    }

    // อัปเดตโปรไฟล์ในฐานข้อมูล
    await db.profile.update({
      where: { id },
      data,
    });

    return true;
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    throw new Error("เกิดข้อผิดพลาดในการอัปเดตโปรไฟล์");
  }
}
