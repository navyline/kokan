import db from "@/utils/db";

export async function verifyUser(userId: string, status: "APPROVED" | "REJECTED") {
  return await db.verification.update({
    where: { userId },
    data: { status },
  });
}
