"use server";

import { uploadFile } from "@/utils/supabase";
import db from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";
import { Condition } from "@prisma/client";

export async function createPostAction(formData: FormData): Promise<string> {
  try {
    const user = await currentUser();
    if (!user) throw new Error("You must be logged in to create a post.");

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
    const category = formData.get("category") as string;
    const condition = formData.get("condition") as Condition;
    const files = formData.getAll("images") as File[]; // รองรับหลายไฟล์

    // สมมติว่า location (lat, lng) มาจาก MapLandmark component
    const lat = parseFloat(formData.get("lat") as string);
    const lng = parseFloat(formData.get("lng") as string);

    if (!name || !description || isNaN(price) || !province || !category || !condition || files.length === 0) {
      throw new Error("Please fill out all required fields.");
    }

    if (isNaN(lat) || isNaN(lng)) {
      throw new Error("Please select a valid location.");
    }

    // อัปโหลดภาพหลายภาพพร้อมกัน
    const imageUploadPromises = files.map((file) => uploadFile(file));
    const imageUrls = await Promise.all(imageUploadPromises);

    const newPost = await db.post.create({
      data: {
        name,
        description,
        price,
        province,
        categoryId: category,
        condition,
        images: imageUrls,
        lat,
        lng,
        profileId: profile.id,
      },
    });

    return `/posts/${newPost.id}`;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error creating post:", error.message);
    } else {
      console.error("Error creating post:", error);
    }
    throw new Error("Failed to create post.");
  }
}
