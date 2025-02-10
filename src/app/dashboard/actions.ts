"use server";

import db from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";
import { TradeStatus } from "@/utils/types";

/**
 * ดึงข้อมูล Dashboard:
 * - Trades (offerById หรือ offerToId เป็น user ปัจจุบัน)
 * - Favorites
 * - Notifications
 * พร้อมส่ง profileId
 */
export async function fetchUserDashboardData() {
  try {
    const user = await currentUser();
    if (!user) throw new Error("ยังไม่ได้ล็อกอิน");

    const profile = await db.profile.findUnique({
      where: { clerkId: user.id },
    });
    if (!profile) throw new Error("ไม่พบ Profile ของผู้ใช้");

    // ✅ ดึง Trade พร้อม include profile ใน postOffered & postWanted
    const trades = await db.trade.findMany({
      where: {
        OR: [{ offerById: profile.id }, { offerToId: profile.id }],
      },
      include: {
        offerBy: true,
        offerTo: true,
        postOffered: {
          include: {
            profile: true, // ✅ Include profile
          },
        },
        postWanted: {
          include: {
            profile: true, // ✅ Include profile
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // ✅ ดึง Favorites พร้อม post ที่มี profile
    const favorites = await db.favorite.findMany({
      where: { profileId: profile.id },
      include: {
        post: {
          include: {
            profile: true, // ✅ Include profile ใน Favorite ด้วย
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // ✅ ดึง Notifications
    const notifications = await db.notification.findMany({
      where: { receiverId: profile.id },
      orderBy: { createdAt: "desc" },
    });

    return {
      profileId: profile.id,
      trades: trades.map((t) => ({
        ...t,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
      })),
      favorites: favorites.map((f) => ({
        ...f,
        createdAt: f.createdAt.toISOString(),
        updatedAt: f.updatedAt.toISOString(),
      })),
      notifications: notifications.map((n) => ({
        ...n,
        createdAt: n.createdAt.toISOString(),
        updatedAt: n.updatedAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("fetchUserDashboardData error:", error);
    return {
      profileId: null,
      trades: [],
      favorites: [],
      notifications: [],
    };
  }
}

/**
 * updateTradeStatus - เปลี่ยนสถานะข้อเสนอ (ACCEPTED, REJECTED, CANCELLED, ฯลฯ)
 * Return Trade ที่อัปเดตแล้ว (status ใหม่) เพื่อให้ Client เอามาอัปเดตใน State ได้
 */
export async function updateTradeStatus(tradeId: string, newStatus: TradeStatus) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("ยังไม่ได้ล็อกอิน");

    const profile = await db.profile.findUnique({
      where: { clerkId: user.id },
    });
    if (!profile) throw new Error("ไม่พบ Profile ของผู้ใช้");

    // ✅ หา Trade พร้อม include profile ใน postOffered & postWanted
    const trade = await db.trade.findUnique({
      where: { id: tradeId },
      include: {
        offerBy: true,
        offerTo: true,
        postOffered: {
          include: {
            profile: true, // ✅ Include profile
          },
        },
        postWanted: {
          include: {
            profile: true, // ✅ Include profile
          },
        },
      },
    });
    if (!trade) throw new Error("ไม่พบ Trade นี้");

    // ✅ ตรวจสิทธิ์
    if (newStatus === "ACCEPTED" || newStatus === "REJECTED") {
      if (trade.offerToId !== profile.id) {
        throw new Error("คุณไม่ใช่ผู้รับข้อเสนอนี้");
      }
    }
    if (newStatus === "CANCELLED") {
      if (trade.offerById !== profile.id) {
        throw new Error("คุณไม่ใช่ผู้ส่งข้อเสนอนี้");
      }
    }

    // ✅ อัปเดตสถานะ
    const updated = await db.trade.update({
      where: { id: tradeId },
      data: {
        status: newStatus,
      },
      include: {
        offerBy: true,
        offerTo: true,
        postOffered: {
          include: {
            profile: true, // ✅ Include profile หลังอัปเดต
          },
        },
        postWanted: {
          include: {
            profile: true, // ✅ Include profile หลังอัปเดต
          },
        },
      },
    });

    return {
      ...updated,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("updateTradeStatus error:", error);
    throw error;
  }
}
