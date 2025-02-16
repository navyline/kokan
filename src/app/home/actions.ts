"use server";

import db from "@/utils/db";
import { Post } from "@/utils/types";

interface FetchPostsParams {
  categoryId?: string | null;
  searchQuery?: string; 
}

interface Category {
  id: string;
  name: string;
}

interface PostWhereClause {
  categoryId?: string;
  OR?: Array<{
    name?: { contains: string; mode: "insensitive" };
    description?: { contains: string; mode: "insensitive" };
  }>;
}

export async function fetchPostsAction({
  categoryId,
  searchQuery,
}: FetchPostsParams): Promise<Post[]> {
  // แทน any ด้วย PostWhereClause
  const whereClause: PostWhereClause = {};

  // กรองตาม category
  if (categoryId) {
    whereClause.categoryId = categoryId;
  }

  // กรองตามข้อความที่ค้นหา
  if (searchQuery) {
    whereClause.OR = [
      { name: { contains: searchQuery, mode: "insensitive" } },
      { description: { contains: searchQuery, mode: "insensitive" } },
    ];
  }

  // Query Prisma
  const posts = await db.post.findMany({
    where: whereClause,
    include: {
      profile: {
        include: {
          verification: true, // ดึงข้อมูล verification ด้วย
        },
      },
      category: {
        select: { name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Map ข้อมูลกลับเป็น Post[]
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
    status: post.status || "AVAILABLE",
    profile: post.profile
      ? {
          id: post.profile.id,
          clerkId: post.profile.clerkId,
          userName: post.profile.userName,
          firstName: post.profile.firstName,
          lastName: post.profile.lastName,
          profileImage: post.profile.profileImage || null,
          verification: post.profile.verification
            ? { status: post.profile.verification.status }
            : null,
        }
      : null,
    category: post.category ? { name: post.category.name } : null,
  }));
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const categories = await db.category.findMany({
      select: {
        id: true,
        name: true,
      },
    });

    // map หรือปรับฟอร์แมตถ้าต้องการ
    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
    }));
  } catch (error) {
    console.error("❌ Error fetching categories:", error);
    return [];
  }
}