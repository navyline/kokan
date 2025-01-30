import db from "@/utils/db";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

export async function uploadVerification(userId: string, file: File) {
  if (!file) throw new Error("File is required");

  // อัพโหลดไฟล์ไปยัง Supabase Storage
  const { data, error } = await supabase.storage
    .from("verifications")
    .upload(`${userId}/${file.name}`, file, { upsert: true });

  if (error) throw new Error("Upload failed");

  // บันทึก URL ไฟล์ลงใน Database
  const verification = await db.verification.upsert({
    where: { userId },
    update: { documentUrl: data.path, status: "PENDING" },
    create: { userId, documentUrl: data.path, status: "PENDING" },
  });

  return verification;
}
