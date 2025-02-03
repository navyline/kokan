"use server";

import db from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";
import { Trade, TradeStatus } from "@/utils/types";

export async function fetchUserTrades(): Promise<Trade[]> {
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
        offerBy: {
          select: {
            id: true,
            clerkId: true,
            userName: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
        offerTo: {
          select: {
            id: true,
            clerkId: true,
            userName: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
        postOffered: {
          select: {
            id: true,
            name: true,
            image: true,
            description: true,
            province: true,
            price: true,
            views: true,
            createdAt: true,
            updatedAt: true,
            profile: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true,
                clerkId: true,
                userName: true,
              },
            },
          },
        },
        postWanted: {
          select: {
            id: true,
            name: true,
            image: true,
            description: true,
            province: true,
            price: true,
            views: true,
            createdAt: true,
            updatedAt: true,
            profile: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                profileImage: true,
                clerkId: true,
                userName: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return trades.map((trade) => ({
      ...trade,
      createdAt: trade.createdAt.toISOString(), // ✅ แปลง Date เป็น string
      updatedAt: trade.updatedAt.toISOString(),
      postOffered: trade.postOffered
        ? {
            ...trade.postOffered,
            createdAt: trade.postOffered.createdAt.toISOString(), // ✅ แปลง Date เป็น string
            updatedAt: trade.postOffered.updatedAt.toISOString(),
          }
        : null, // ✅ ถ้าไม่มีข้อมูล ให้เป็น `null`
      postWanted: trade.postWanted
        ? {
            ...trade.postWanted,
            createdAt: trade.postWanted.createdAt.toISOString(), // ✅ แปลง Date เป็น string
            updatedAt: trade.postWanted.updatedAt.toISOString(),
          }
        : null, // ✅ ถ้าไม่มีข้อมูล ให้เป็น `null`
    }));
  } catch (error) {
    console.error("Error fetching user trades:", error);
    return [];
  }
}

/**
 * อัปเดตสถานะของ Trade
 * @param tradeId - ID ของการแลกเปลี่ยน
 * @param status - สถานะใหม่ของ Trade ("PENDING", "ACCEPTED", "REJECTED", "CANCELLED", "COMPLETED")
 */
export async function updateTradeStatus(tradeId: string, status: TradeStatus) {
  try {
    // ✅ ตรวจสอบว่า Trade มีอยู่จริง
    const existingTrade = await db.trade.findUnique({
      where: { id: tradeId },
    });

    if (!existingTrade) {
      return {
        success: false,
        message: "Trade not found",
      };
    }

    const updatedTrade = await db.trade.update({
      where: { id: tradeId },
      data: { status },
      include: {
        offerBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
        offerTo: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
        postOffered: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        postWanted: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return {
      success: true,
      message: "Trade status updated successfully",
      trade: updatedTrade,
    };
  } catch (error) {
    console.error("Error updating trade status:", error);
    return {
      success: false,
      message: "Failed to update trade status",
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
