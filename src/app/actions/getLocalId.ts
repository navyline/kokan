"use server";

import db from "@/utils/db";

/**
 * รับ FormData ที่มี clerkId และ query Prisma เพื่อคืนค่า localId (UUID)
 * จากตาราง Profile (สมมติว่ามีคอลัมน์ clerkId ตรงกับ user.id ของ Clerk)
 */
export async function getLocalIdByClerkId(formData: FormData): Promise<string | null> {
  try {
    // รับค่า clerkId จาก FormData
    const clerkId = formData.get("clerkId")?.toString();

    // ตรวจสอบว่ามี clerkId หรือไม่
    if (!clerkId || typeof clerkId !== "string") {
      throw new Error("Invalid or missing clerkId");
    }

    // Query จากฐานข้อมูล
    const profile = await db.profile.findUnique({
      where: { clerkId },
      select: { id: true }, // 'id' คือ UUID ที่เป็น Primary Key ใน DB
    });

    // ถ้าไม่พบ profile คืน null
    if (!profile) {
      return null;
    }

    // คืนค่า localId (UUID)
    return profile.id;
  } catch (error) {
    console.error("Error in getLocalIdByClerkId:", error);
    throw new Error("Failed to fetch localId");
  }
}
