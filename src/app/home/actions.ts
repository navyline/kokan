"use server";

import db from "@/utils/db";

type Post = {
  id: string;
  name: string;
  image?: string;
  profile?: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string | null;
  } | null;
  category?: {
    name: string;
  } | null;
};

/**
 * ดึงโพสต์ทั้งหมดจากฐานข้อมูล โดยสามารถกรองตาม Category ได้
 */
export async function fetchPostsAction(categoryId: string | null = null): Promise<Post[]> {
  try {
    if (!db) {
      console.error("❌ Database instance is not available.");
      throw new Error("Database connection error");
    }

    const posts = await db.post.findMany({
      where: categoryId ? { categoryId } : {},
      include: {
        profile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return posts.map((post) => ({
      id: post.id,
      name: post.name,
      image: post.image || undefined,
      profile: post.profile
        ? {
            id: post.profile.id,
            firstName: post.profile.firstName,
            lastName: post.profile.lastName,
            profileImage: post.profile.profileImage || null,
          }
        : null,
      category: post.category ? { name: post.category.name } : null,
    }));
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
}

/**
 * ดึงหมวดหมู่ทั้งหมดจากฐานข้อมูล
 */
export async function fetchCategories() {
  try {
    if (!db) {
      console.error("❌ Database instance is not available.");
      throw new Error("Database connection error");
    }

    const categories = await db.category.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    return categories;
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    return [];
  }
}
