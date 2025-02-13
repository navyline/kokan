import db from "@/utils/db";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_KEY as string
);

export async function uploadVerification(userId: string, file: File) {
  if (!file) throw new Error("File is required");

  const { data, error } = await supabase.storage
    .from("verifications")
    .upload(`${userId}/${file.name}`, file, { upsert: true });

  if (error) throw new Error("Upload failed");

  const verification = await db.verification.upsert({
    where: { userId },
    update: { documentUrl: data.path, status: "PENDING" },
    create: { userId, documentUrl: data.path, status: "PENDING" },
  });

  return verification;
}
