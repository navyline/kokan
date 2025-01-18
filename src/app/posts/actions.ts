"use server";

import prisma from "@/utils/db";

// ฟังก์ชันสร้างโพสต์ใหม่
export async function createPostAction(data: {
  name: string;
  description: string;
  image?: string;
  price: number;
  province: string;
  lat?: number;
  lng?: number;
  profileId: string;
  categoryId?: string;
}) {
  try {
    const post = await prisma.post.create({
      data: {
        name: data.name,
        description: data.description,
        image: data.image,
        price: data.price,
        province: data.province,
        lat: data.lat,
        lng: data.lng,
        profileId: data.profileId,
        categoryId: data.categoryId,
      },
    });

    return post;
  } catch (error) {
    console.error("Error creating post:", error);
    throw new Error("Failed to create post.");
  }
}

// ฟังก์ชันดึงโพสต์ทั้งหมด
export async function fetchPostsAction() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        profile: true, // รวมโปรไฟล์ของผู้สร้างโพสต์
        category: true, // รวมหมวดหมู่
        favorites: true, // รวมรายการโปรด
      },
    });

    return posts;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts.");
  }
}

// ฟังก์ชันอัปเดตโพสต์
export async function updatePostAction(data: {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  status?: string;
}) {
  try {
    const post = await prisma.post.update({
      where: { id: data.id },
      data: {
        name: data.name,
        description: data.description,
        price: data.price,
        status: data.status,
      },
    });

    return post;
  } catch (error) {
    console.error("Error updating post:", error);
    throw new Error("Failed to update post.");
  }
}

// ฟังก์ชันลบโพสต์
export async function deletePostAction(id: string) {
  try {
    await prisma.post.delete({
      where: { id },
    });

    return { message: "Post deleted successfully." };
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("Failed to delete post.");
  }
}
