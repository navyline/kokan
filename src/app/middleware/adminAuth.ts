"use server";

import { auth } from "@clerk/nextjs/server";
import db from "@/utils/db";

export async function checkAdmin() {
  const { userId } = await auth();
  if (!userId) return false;

  // ค้นหา User และเช็ค role
  const user = await db.profile.findUnique({
    where: { clerkId: userId },
    select: { role: true },
  });

  return user?.role === "ADMIN";
}