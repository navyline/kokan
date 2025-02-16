"use server";

import db from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";

/**
 * submitVerificationRequest:
 * รับ FormData สำหรับการยืนยันตัวตนจากผู้ใช้ แล้วสร้างหรืออัปเดต request
 */
export async function submitVerificationRequest(formData: FormData): Promise<void> {
  "use server";
  const documentUrl = formData.get("documentUrl")?.toString();
  if (!documentUrl) throw new Error("Missing documentUrl");

  const user = await currentUser();
  if (!user) throw new Error("Not authenticated");

  // ค้นหา profile ของผู้ใช้
  const profile = await db.profile.findUnique({
    where: { clerkId: user.id },
  });
  if (!profile) throw new Error("Profile not found");

  // ตรวจสอบว่ามี request ยืนยันตัวตนอยู่แล้วหรือไม่
  const existingVerification = await db.verification.findUnique({
    where: { userId: profile.id },
  });

  if (existingVerification) {
    // อัปเดต request หากมีอยู่แล้ว ให้รีเซ็ตสถานะเป็น PENDING
    await db.verification.update({
      where: { userId: profile.id },
      data: {
        documentUrl,
        status: "PENDING",
      },
    });
  } else {
    // สร้าง request ยืนยันตัวตนใหม่
    await db.verification.create({
      data: {
        userId: profile.id,
        documentUrl,
        status: "PENDING", // เริ่มต้นเป็น PENDING
      },
    });
  }
}

/**
 * getVerificationStatus:
 * ดึงสถานะการยืนยันตัวตนของผู้ใช้
 */
export async function getVerificationStatus(): Promise<string | null> {
  const user = await currentUser();
  if (!user) return null;

  const profile = await db.profile.findUnique({
    where: { clerkId: user.id },
  });
  if (!profile) return null;

  const verification = await db.verification.findUnique({
    where: { userId: profile.id },
  });
  return verification ? verification.status : null;
}
