"use server";

import db from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";

// =====================
// 1. ดึงรายละเอียดโพสต์
// =====================
export const fetchPostDetail = async ({ id }: { id: string }) => {
  try {
    const post = await db.post.findUnique({
      where: { id },
      include: {
        profile: true,
        comments: {
          include: {
            profile: true, // ✅ ดึงข้อมูลโปรไฟล์ของผู้คอมเมนต์
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        favorites: true, // ✅ ดึงข้อมูล Favorite ด้วย
      },
    });

    return post;
  } catch (error) {
    console.error("Error fetching post detail:", error);
    return null;
  }
};

// =====================
// 2. เพิ่มคอมเมนต์
// =====================
export async function addComment({ postId, content }: { postId: string; content: string }) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Not authenticated");

    const profile = await db.profile.findUnique({
      where: { clerkId: user.id },
    });

    if (!profile) throw new Error("No Profile found for current user");

    const newComment = await db.comment.create({
      data: {
        content,
        postId,
        profileId: profile.id,
      },
      include: {
        profile: true,
      },
    });

    return newComment;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}

// =====================
// 3. Toggle Favorite
// =====================
export async function toggleFavorite({ postId }: { postId: string }) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Not authenticated");

    const profile = await db.profile.findUnique({
      where: { clerkId: user.id },
    });

    if (!profile) throw new Error("No Profile found for current user");

    const existingFavorite = await db.favorite.findFirst({
      where: {
        postId,
        profileId: profile.id,
      },
    });

    if (existingFavorite) {
      await db.favorite.delete({ where: { id: existingFavorite.id } });
      return { isFavorite: false };
    } else {
      await db.favorite.create({
        data: {
          postId,
          profileId: profile.id,
        },
      });
      return { isFavorite: true };
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    throw error;
  }
}

export async function makeTradeOffer({ postId }: { postId: string }) {
  try {
    const response = await fetch("/api/trade", {
      method: "POST",
      body: JSON.stringify({ postId }),
    });
    return response.json();
  } catch (error) {
    console.error("Error making trade offer:", error);
    throw error;
  }
}