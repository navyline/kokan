"use server";

import db from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";

// ===========================
// 1. ดึงรายละเอียดโพสต์
// ===========================
export const fetchPostDetail = async ({ id }: { id: string }) => {
  try {
    const post = await db.post.findUnique({
      where: { id },
      include: {
        profile: true,
        category: true,
        comments: {
          include: {
            profile: true,
          },
          orderBy: { createdAt: "desc" },
        },
        favorites: true,
      },
    });
    return post;
  } catch (error) {
    console.error("Error fetching post detail:", error);
    return null;
  }
};

// ===========================
// 2. ดึงรายการโพสต์ของ user ปัจจุบัน
// ===========================
export async function fetchUserItems() {
  try {
    const user = await currentUser();
    if (!user) return [];

    const profile = await db.profile.findUnique({
      where: { clerkId: user.id },
    });
    if (!profile) return [];

    const userPosts = await db.post.findMany({
      where: {
        profileId: profile.id,
        status: "AVAILABLE",
      },
    });

    return userPosts;
  } catch (error) {
    console.error("Error fetching user items:", error);
    return [];
  }
}

// ===========================
// 3. เพิ่มคอมเมนต์
// ===========================
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

// ===========================
// 4. Toggle Favorite
// ===========================
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

// ===========================
// 5. Make an Offer
// ===========================
interface MakeTradeOfferInput {
  postId: string;
  offeredPostId: string;
}

export async function makeTradeOffer({ postId, offeredPostId }: MakeTradeOfferInput) {
  try {
    const user = await currentUser();
    if (!user) throw new Error("Not authenticated");

    const profile = await db.profile.findUnique({
      where: { clerkId: user.id },
    });
    if (!profile) throw new Error("No Profile found for current user");

    const offeredPost = await db.post.findUnique({
      where: { id: offeredPostId },
    });
    if (!offeredPost) throw new Error("Offered post not found");
    if (offeredPost.profileId !== profile.id) {
      throw new Error("You do not own this offered post!");
    }

    const wantedPost = await db.post.findUnique({
      where: { id: postId },
    });
    if (!wantedPost) throw new Error("Wanted post not found");

    const newTrade = await db.trade.create({
      data: {
        offerById: profile.id,
        offerToId: wantedPost.profileId,
        postOfferedId: offeredPostId,
        postWantedId: postId,
        status: "PENDING",
      },
    });

    return newTrade;
  } catch (error) {
    console.error("Error making trade offer:", error);
    throw error;
  }
}
