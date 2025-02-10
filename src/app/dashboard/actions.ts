"use server";

import db from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";
import { TradeStatus } from "@/utils/types";

/**
 * fetchUserDashboardData:
 * ดึงข้อมูล Dashboard ของผู้ใช้:
 * - Trades (ข้อเสนอที่ส่งและได้รับ)
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

    // ดึง Trade พร้อม include ข้อมูลของ postOffered & postWanted
    const trades = await db.trade.findMany({
      where: {
        OR: [{ offerById: profile.id }, { offerToId: profile.id }],
      },
      include: {
        offerBy: true,
        offerTo: true,
        postOffered: {
          include: {
            profile: true,
          },
        },
        postWanted: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // ดึง Favorites พร้อมข้อมูล post และ profile
    const favorites = await db.favorite.findMany({
      where: { profileId: profile.id },
      include: {
        post: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // ดึง Notifications
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
 * updateTradeStatus:
 * เปลี่ยนสถานะข้อเสนอ (ACCEPTED, REJECTED, CANCELLED, ฯลฯ)
 * ฟังก์ชันนี้จะไม่คืนค่าอะไร (void)
 */
export async function updateTradeStatus(tradeId: string, newStatus: TradeStatus): Promise<void> {
  try {
    const user = await currentUser();
    if (!user) throw new Error("ยังไม่ได้ล็อกอิน");

    const profile = await db.profile.findUnique({
      where: { clerkId: user.id },
    });
    if (!profile) throw new Error("ไม่พบ Profile ของผู้ใช้");

    // หา Trade พร้อม include ข้อมูลใน postOffered & postWanted
    const trade = await db.trade.findUnique({
      where: { id: tradeId },
      include: {
        offerBy: true,
        offerTo: true,
        postOffered: {
          include: {
            profile: true,
          },
        },
        postWanted: {
          include: {
            profile: true,
          },
        },
      },
    });
    if (!trade) throw new Error("ไม่พบ Trade นี้");

    // ตรวจสอบสิทธิ์: สำหรับ ACCEPTED/REJECTED ให้เฉพาะผู้รับข้อเสนอ
    if ((newStatus === "ACCEPTED" || newStatus === "REJECTED") && trade.offerToId !== profile.id) {
      throw new Error("คุณไม่ใช่ผู้รับข้อเสนอนี้");
    }
    // สำหรับ CANCELLED ให้เฉพาะผู้ส่งข้อเสนอ
    if (newStatus === "CANCELLED" && trade.offerById !== profile.id) {
      throw new Error("คุณไม่ใช่ผู้ส่งข้อเสนอนี้");
    }

    await db.trade.update({
      where: { id: tradeId },
      data: { status: newStatus },
      include: {
        offerBy: true,
        offerTo: true,
        postOffered: {
          include: {
            profile: true,
          },
        },
        postWanted: {
          include: {
            profile: true,
          },
        },
      },
    });
    // ไม่คืนค่าใด ๆ
  } catch (error) {
    console.error("updateTradeStatus error:", error);
    throw error;
  }
}

/**
 * updateTradeStatusAction:
 * Server Action ที่รับ FormData และเรียก updateTradeStatus
 * คืนค่าเป็น Promise<void> (ไม่คืนค่าอะไร)
 */
export async function updateTradeStatusAction(formData: FormData): Promise<void> {
  "use server";
  const tradeId = formData.get("tradeId")?.toString();
  const newStatus = formData.get("newStatus")?.toString();
  if (!tradeId || !newStatus) {
    throw new Error("Missing tradeId or newStatus");
  }
  await updateTradeStatus(tradeId, newStatus as TradeStatus);
  // คืนค่า void
}
