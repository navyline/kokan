"use server";

import db from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";

// ❶ ตัวอย่าง: import ฟังก์ชันอัปโหลดของคุณจาก supabase
import { uploadFile } from "@/utils/supabase";

/**
 * ดึงข้อมูล Profile จาก DB
 */
export async function getProfileById(id: string) {
  try {
    const profile = await db.profile.findUnique({ where: { id } });
    return profile;
  } catch (error) {
    console.error("❌ Error getProfileById:", error);
    return null;
  }
}

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

/**
 * submitVerificationRequestAction:
 * รับ FormData สำหรับการยืนยันตัวตน (phone, address, documentImage)
 * แล้วบันทึก/อัปเดตลงในตาราง verification (มีการอัปโหลดไฟล์จริง)
 */
export async function submitVerificationRequestAction(formData: FormData): Promise<void> {
  "use server";

  const profileId = formData.get("profileId")?.toString();
  const phone = formData.get("phone")?.toString();
  const address = formData.get("address")?.toString();
  const documentImage = formData.get("documentImage") as File | null;

  if (!profileId || !phone || !address || !documentImage) {
    throw new Error("ข้อมูลไม่ครบถ้วน");
  }

  // ตรวจสอบว่า user ปัจจุบันตรงกับ profileId นี้หรือไม่
  const user = await currentUser();
  if (!user) throw new Error("ยังไม่ได้ล็อกอิน");

  // ตรวจสอบใน DB
  const profile = await db.profile.findUnique({
    where: { id: profileId },
  });
  if (!profile) throw new Error("ไม่พบโปรไฟล์นี้");
  if (profile.clerkId !== user.id) {
    throw new Error("ไม่มีสิทธิ์ยืนยันตัวตนของผู้อื่น");
  }

  // ❷ อัปโหลดไฟล์จริงด้วยฟังก์ชัน uploadFile (เช่น Supabase)
  // สมมติว่าเราอัปโหลดไฟล์ไป bucket ชื่อ "verification-docs"
  // แล้วฟังก์ชัน uploadFile จะ return URL ที่เข้าถึงรูปได้
  const uploadedUrl = await uploadFile(documentImage);

  // ตรวจสอบว่ามี verification record อยู่แล้วไหม
  const existingVerification = await db.verification.findUnique({
    where: { userId: profileId },
  });

  if (!existingVerification) {
    // สร้างใหม่
    await db.verification.create({
      data: {
        userId: profileId,
        documentUrl: uploadedUrl, // บันทึก URL ของไฟล์ที่อัปโหลด
        status: "PENDING",
        // สมมติว่าอยากเก็บ phone, address ด้วย
        phone,   // ต้องแก้ schema verification ให้มีฟิลด์ phone
        address, // ต้องแก้ schema verification ให้มีฟิลด์ address
      },
    });
  } else {
    // อัปเดต
    await db.verification.update({
      where: { userId: profileId },
      data: {
        documentUrl: uploadedUrl, 
        status: "PENDING",
        phone,
        address,
      },
    });
  }

  // หรือถ้าคุณอยาก update phone, address ใน Profile table แทน
  // await db.profile.update({ ... });
}
