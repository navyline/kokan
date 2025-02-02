"use server";

import db from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";

// ✅ 1️⃣ ดึงรายการแลกเปลี่ยนที่เกี่ยวข้องกับผู้ใช้
export async function fetchUserTrades() {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Not authenticated");

    const profile = await db.profile.findUnique({
      where: { clerkId: user.id },
    });

    if (!profile) throw new Error("Profile not found");

    const trades = await db.trade.findMany({
      where: {
        OR: [{ offerById: profile.id }, { offerToId: profile.id }],
      },
      include: {
        offerBy: true,
        offerTo: true,
        postOffered: true,
        postWanted: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return trades;
  } catch (error) {
    console.error("Error fetching user trades:", error);
    return [];
  }
}

// ✅ 2️⃣ อัปเดตสถานะการแลกเปลี่ยน
export async function updateTradeStatus({
  tradeId,
  status,
}: {
  tradeId: string;
  status: "ACCEPTED" | "REJECTED" | "CANCELLED" | "COMPLETED";
}) {
  try {
    const trade = await db.trade.update({
      where: { id: tradeId },
      data: { status },
    });

    return trade;
  } catch (error) {
    console.error("Error updating trade status:", error);
    throw error;
  }
}
