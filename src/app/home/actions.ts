"use server";

import db from "@/utils/db";

type Post = {
  id: string;
  name: string;
  image?: string;
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
  category: {
    name: string;
  };
};

export async function fetchPostsAction(
  categoryId: string | null = null
): Promise<Post[]> {
  try {
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
      profile: {
        id: post.profile.id,
        firstName: post.profile.firstName,
        lastName: post.profile.lastName,
        profileImage: post.profile.profileImage || undefined,
      },
      category: {
        name: post.category?.name || "Uncategorized",
      },
    }));
  } catch (error) {
    console.error("❌ Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
}

// ดึงหมวดหมู่จาก Database
export async function fetchCategories() {
  try {
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
