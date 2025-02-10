"use server";

import db from "@/utils/db";
import { auth } from "@clerk/nextjs/server";

// ✅ ดึงรายการโพสต์ที่ Favorite
export const getFavorites = async () => {
  try {
    const { userId } = await auth();

    // ✅ ถ้าไม่ได้ล็อกอิน → รีเทิร์น []
    if (!userId) {
      console.warn("getFavorites: User not authenticated");
      return [];
    }

    const favorites = await db.favorite.findMany({
      where: { profileId: userId },
      include: { post: true },
    });

    return favorites.map((fav) => ({
      id: fav.post.id,
      name: fav.post.name,
      // แก้: ใช้ fav.post.images[0] แทน fav.post.image (หากมีรูปอยู่)
      image:
        fav.post.images && fav.post.images.length > 0
          ? fav.post.images[0]
          : "/default-image.jpg",
      province: fav.post.province,
      price: fav.post.price,
    }));
  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
};

// ✅ กด Favorite หรือยกเลิก
export const toggleFavorite = async ({ postId }: { postId: string }) => {
  try {
    const { userId } = await auth();

    // ✅ ถ้าไม่ได้ล็อกอิน → รีเทิร์น Error
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const existingFavorite = await db.favorite.findFirst({
      where: { postId, profileId: userId },
    });

    if (existingFavorite) {
      await db.favorite.delete({ where: { id: existingFavorite.id } });
      return { isFavorite: false };
    } else {
      await db.favorite.create({ data: { postId, profileId: userId } });
      return { isFavorite: true };
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return { isFavorite: false };
  }
};
