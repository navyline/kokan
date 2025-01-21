"use server";

import db from "@/utils/db";

/**
 * รับ FormData ที่มี clerkId และ query Prisma เพื่อคืนค่า localId (UUID) 
 * จากตาราง Profile (สมมติว่ามีคอลัมน์ clerkId ตรงกับ user.id ของ Clerk)
 */
export async function getLocalIdByClerkId(formData: FormData): Promise<string | null> {
  const clerkId = formData.get("clerkId")?.toString();
  if (!clerkId) {
    throw new Error("Missing clerkId");
  }

  const profile = await db.profile.findUnique({
    where: { clerkId },
    select: { id: true }, // 'id' คือ UUID ที่เป็น Primary Key ใน DB
  });

  if (!profile) {
    return null;
  }
  return profile.id; // UUID
}
