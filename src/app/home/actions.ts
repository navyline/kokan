"use server";

import db from "@/utils/db";
import { Post } from "@/utils/types";

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
            userName: true,
            clerkId: true,
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
      image: post.image || null,
      description: post.description, // ✅ เพิ่มฟิลด์ที่ขาด
      province: post.province, // ✅ เพิ่มฟิลด์ที่ขาด
      price: post.price, // ✅ เพิ่มฟิลด์ที่ขาด
      createdAt: post.createdAt.toISOString(), // ✅ แปลงเป็น string
      updatedAt: post.updatedAt.toISOString(), // ✅ แปลงเป็น string
      views: post.views || 0,
      tags: post.tags || null,
      profile: post.profile
  ? {
      id: post.profile.id,
      clerkId: post.profile.clerkId, // ✅ เพิ่ม clerkId
      userName: post.profile.userName, // ✅ เพิ่ม userName
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
