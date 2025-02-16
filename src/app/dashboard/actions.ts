// actions.ts
"use server";

import db from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";
import { TradeStatus, Condition } from "@/utils/types";

/**
 * fetchUserDashboardData:
 * ดึงข้อมูลแดชบอร์ดของผู้ใช้:
 * - Trades (ข้อเสนอที่ส่งและได้รับ)
 * - Favorites
 * - Notifications
 * - Posts (โพสที่ผู้ใช้สร้าง)
 */
export async function fetchUserDashboardData() {
  try {
    const user = await currentUser();
    if (!user) throw new Error("ยังไม่ได้ล็อกอิน");

    const profile = await db.profile.findUnique({
      where: { clerkId: user.id },
    });
    if (!profile) throw new Error("ไม่พบ Profile ของผู้ใช้");

    // ดึง Trades
    const trades = await db.trade.findMany({
      where: {
        OR: [{ offerById: profile.id }, { offerToId: profile.id }],
      },
      include: {
        offerBy: true,
        offerTo: true,
        postOffered: {
          include: { profile: true, category: true },
        },
        postWanted: {
          include: { profile: true, category: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // ดึง Favorites
    const favorites = await db.favorite.findMany({
      where: { profileId: profile.id },
      include: {
        post: {
          include: { profile: true, category: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // ดึง Notifications
    const notifications = await db.notification.findMany({
      where: { receiverId: profile.id },
      orderBy: { createdAt: "desc" },
    });

    // ดึง Posts ที่ผู้ใช้สร้าง
    const posts = await db.post.findMany({
      where: { profileId: profile.id },
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });

    return {
      profileId: profile.id,
      trades: trades.map((t) => ({
        ...t,
        createdAt: t.createdAt.toISOString(),
        updatedAt: t.updatedAt.toISOString(),
        postOffered: t.postOffered
          ? {
              ...t.postOffered,
              createdAt: t.postOffered.createdAt.toISOString(),
              updatedAt: t.postOffered.updatedAt.toISOString(),
            }
          : null,
        postWanted: t.postWanted
          ? {
              ...t.postWanted,
              createdAt: t.postWanted.createdAt.toISOString(),
              updatedAt: t.postWanted.updatedAt.toISOString(),
            }
          : null,
      })),
      favorites: favorites.map((f) => ({
        ...f,
        createdAt: f.createdAt.toISOString(),
        updatedAt: f.updatedAt.toISOString(),
        post: f.post
          ? {
              ...f.post,
              createdAt: f.post.createdAt.toISOString(),
              updatedAt: f.post.updatedAt.toISOString(),
            }
          : null,
      })),
      notifications: notifications.map((n) => ({
        ...n,
        createdAt: n.createdAt.toISOString(),
        updatedAt: n.updatedAt.toISOString(),
      })),
      posts: posts.map((p) => ({
        ...p,
        createdAt: p.createdAt.toISOString(),
        updatedAt: p.updatedAt.toISOString(),
      })),
    };
  } catch (error) {
    console.error("fetchUserDashboardData error:", error);
    return {
      profileId: null,
      trades: [],
      favorites: [],
      notifications: [],
      posts: [],
    };
  }
}

/**
 * updateTradeStatus:
 * เปลี่ยนสถานะข้อเสนอ (ACCEPTED, REJECTED, CANCELLED, ฯลฯ)
 * หากข้อเสนอถูกยอมรับ (ACCEPTED) จะเปลี่ยนสถานะโพสต์ที่เกี่ยวข้องเป็น "TRADED"
 */
export async function updateTradeStatus(tradeId: string, newStatus: TradeStatus): Promise<void> {
  try {
    const user = await currentUser();
    if (!user) throw new Error("ยังไม่ได้ล็อกอิน");

    const profile = await db.profile.findUnique({
      where: { clerkId: user.id },
    });
    if (!profile) throw new Error("ไม่พบ Profile ของผู้ใช้");

    // หา Trade พร้อม include ข้อมูลที่จำเป็น
    const trade = await db.trade.findUnique({
      where: { id: tradeId },
      include: {
        offerBy: true,
        offerTo: true,
        postOffered: true,
        postWanted: true,
      },
    });
    if (!trade) throw new Error("ไม่พบ Trade นี้");

    // ตรวจสอบสิทธิ์:
    // สำหรับ ACCEPTED/REJECTED: เฉพาะผู้รับข้อเสนอเท่านั้น
    if ((newStatus === "ACCEPTED" || newStatus === "REJECTED") && trade.offerToId !== profile.id) {
      throw new Error("คุณไม่ใช่ผู้รับข้อเสนอนี้");
    }
    // สำหรับ CANCELLED: เฉพาะผู้ส่งข้อเสนอเท่านั้น
    if (newStatus === "CANCELLED" && trade.offerById !== profile.id) {
      throw new Error("คุณไม่ใช่ผู้ส่งข้อเสนอนี้");
    }

    // อัปเดตสถานะของ Trade
    await db.trade.update({
      where: { id: tradeId },
      data: { status: newStatus },
    });

    // หากข้อเสนอถูกยอมรับ ให้เปลี่ยนสถานะของโพสต์ที่เกี่ยวข้องเป็น "TRADED"
    if (newStatus === "ACCEPTED") {
      await db.post.updateMany({
        where: {
          id: { in: [trade.postOfferedId!, trade.postWantedId!] },
        },
        data: { status: "TRADED" },
      });
    }
  } catch (error) {
    console.error("updateTradeStatus error:", error);
    throw error;
  }
}

/**
 * updateTradeStatusAction:
 * Server Action ที่รับ FormData และเรียก updateTradeStatus
 */
export async function updateTradeStatusAction(formData: FormData): Promise<void> {
  "use server";
  const tradeId = formData.get("tradeId")?.toString();
  const newStatus = formData.get("newStatus")?.toString();
  if (!tradeId || !newStatus) {
    throw new Error("Missing tradeId or newStatus");
  }
  await updateTradeStatus(tradeId, newStatus as TradeStatus);
}

/**
 * deletePostAction:
 * รับ FormData ที่มี postId และลบโพสต์ (หลังตรวจสอบสิทธิ์)
 */
export async function deletePostAction(formData: FormData): Promise<void> {
  "use server";
  const postId = formData.get("postId")?.toString();
  if (!postId) throw new Error("Missing postId");

  const user = await currentUser();
  if (!user) throw new Error("ยังไม่ได้ล็อกอิน");

  const profile = await db.profile.findUnique({
    where: { clerkId: user.id },
  });
  if (!profile) throw new Error("ไม่พบ Profile ของผู้ใช้");

  // ตรวจสอบว่าโพสต์นี้เป็นของผู้ใช้
  const post = await db.post.findUnique({
    where: { id: postId },
  });
  if (!post || post.profileId !== profile.id) {
    throw new Error("คุณไม่สามารถลบโพสต์นี้ได้");
  }

  await db.post.delete({
    where: { id: postId },
  });
}

/**
 * updatePostAction:
 * Server Action สำหรับอัปเดตโพสต์
 * รับ FormData และอัปเดตข้อมูลโพสต์ รวมถึงรูปภาพ
 *
 * สมมติว่า:
 * - ฟิลด์ "images" จะส่งเป็น comma-separated string ของลิงก์ (รวมทั้งรูปที่คงอยู่และรูปใหม่ที่อัปโหลดไปแล้ว)
 */
export async function updatePostAction(formData: FormData): Promise<void> {
  "use server";
  const postId = formData.get("postId")?.toString();
  if (!postId) throw new Error("Missing postId");

  const name = formData.get("name")?.toString() || "";
  const description = formData.get("description")?.toString() || "";
  const price = Number(formData.get("price")) || 0;
  const condition = formData.get("condition")?.toString() || "USED";
  const imagesStr = formData.get("images")?.toString() || "";
  // สมมติว่า imagesStr เป็น comma-separated string
  const images = imagesStr.split(",").map((s) => s.trim()).filter(Boolean);

  const user = await currentUser();
  if (!user) throw new Error("ยังไม่ได้ล็อกอิน");

  const profile = await db.profile.findUnique({
    where: { clerkId: user.id },
  });
  if (!profile) throw new Error("ไม่พบ Profile ของผู้ใช้");

  const post = await db.post.findUnique({ where: { id: postId } });
  if (!post || post.profileId !== profile.id) {
    throw new Error("คุณไม่สามารถแก้ไขโพสต์นี้ได้");
  }

  await db.post.update({
    where: { id: postId },
    data: {
      name,
      description,
      price,
      condition: condition as Condition,
      images,
    },
  });
}
