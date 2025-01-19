"use server";

import { uploadFile } from "@/utils/supabase";
import db from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";

export const createPostAction = async (formData: FormData): Promise<{ message: string }> => {
  try {
    const user = await currentUser();
    if (!user) {
      throw new Error("You must be logged in to create a post.");
    }

    const profile = await db.profile.findUnique({
      where: { clerkId: user.id },
    });

    if (!profile) {
      throw new Error("Profile not found. Please create a profile before creating a post.");
    }

    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const price = parseFloat(formData.get("price") as string);
    const province = formData.get("province") as string;
    const category = formData.get("category") as string; // ดึงข้อมูลประเภทจาก form
    const image = formData.get("image") as File;

    if (!name || !description || isNaN(price) || !province || !category || !image) {
      throw new Error("Please fill out all required fields.");
    }

    const imageUrl = await uploadFile(image);

    await db.post.create({
      data: {
        name,
        description,
        price,
        province,
        categoryId: category, // บันทึก Category ID
        image: imageUrl,
        profileId: profile.id,
      },
    });

    return { message: "Post created successfully!" };
  } catch (error: any) {
    console.error("Error creating post:", error.message);
    throw new Error("Failed to create post.");
  }
};
