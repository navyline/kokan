"use server";

import db from "@/utils/db";
import { Post } from "@/utils/types";

interface FetchPostsParams {
  categoryId?: string | null;
  searchQuery?: string; // เพิ่มพารามิเตอร์สำหรับการค้นหา
}

export async function fetchPostsAction({
  categoryId,
  searchQuery,
}: FetchPostsParams): Promise<Post[]> {
  try {
    if (!db) {
      console.error("❌ Database instance is not available.");
      throw new Error("Database connection error");
    }

    // สร้างเงื่อนไข (where) เพื่อกรองข้อมูล
    const whereClause: {
      categoryId?: string;
      OR?: Array<{
        name?: { contains: string; mode: "insensitive" };
        description?: { contains: string; mode: "insensitive" };
      }>;
    } = {};

    // กรองตาม category
    if (categoryId) {
      whereClause.categoryId = categoryId;
    }

    // กรองตามข้อความที่ค้นหา (searchQuery) ด้วย OR เช่น ตรวจชื่อโพสต์ หรือรายละเอียดโพสต์
    if (searchQuery) {
      whereClause.OR = [
        {
          name: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        // จะขยายไปค้นหาใน field อื่น (เช่น province, tags) ก็ได้ เช่น:
        // {
        //   province: {
        //     contains: searchQuery,
        //     mode: "insensitive",
        //   },
        // },
        // {
        //   tags: {
        //     has: searchQuery, // ถ้าเป็น array
        //   },
        // },
      ];
    }

    // ดึง posts ตามเงื่อนไข
    const posts = await db.post.findMany({
      where: whereClause,
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

    // map ข้อมูลให้อยู่ในรูปแบบที่ต้องการ
    return posts.map((post) => ({
      id: post.id,
      name: post.name,
      images: post.images || [],
      description: post.description,
      province: post.province,
      price: post.price,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      views: post.views || 0,
      tags: post.tags || null,
      profile: post.profile
        ? {
            id: post.profile.id,
            clerkId: post.profile.clerkId,
            userName: post.profile.userName,
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
 * ฟังก์ชันดึงหมวดหมู่
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
