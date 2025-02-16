"use server";

import db from "@/utils/db";
import { Condition } from "@/utils/types";
import { currentUser } from "@clerk/nextjs/server";

/**
 * fetchPostForEdit:
 * ดึงข้อมูลโพสต์จากฐานข้อมูล โดยตรวจสอบว่าผู้ใช้เป็นเจ้าของโพสต์หรือไม่
 * หากไม่ใช่เจ้าของ ให้ return null
 */
export async function fetchPostForEdit(postId: string, clerkUserId: string) {
  // หาตัวตนของโปรไฟล์จาก clerkUserId
  const profile = await db.profile.findUnique({
    where: { clerkId: clerkUserId },
  });
  if (!profile) return null;

  // ดึงโพสต์ตาม postId
  const post = await db.post.findUnique({
    where: { id: postId },
  });
  if (!post) return null;

  // ตรวจสอบความเป็นเจ้าของ
  if (post.profileId !== profile.id) {
    return null;
  }

  return post;
}

/**
 * updatePostAction:
 * Server Action สำหรับอัปเดตข้อมูลโพสต์
 * รับ FormData และทำการ update ในฐานข้อมูล
 */
export async function updatePostAction(formData: FormData) {
  const postId = formData.get("postId")?.toString();
  if (!postId) throw new Error("Missing postId");

  const name = formData.get("name")?.toString() || "";
  const description = formData.get("description")?.toString() || "";
  const price = Number(formData.get("price")) || 0;
  const condition = formData.get("condition")?.toString() as Condition || "USED";
  const imagesStr = formData.get("images")?.toString() || "";

  // แยกรูปภาพ (ถ้าคุณเก็บเป็น array ใน Prisma)
  // สมมติว่าเราเก็บรูปเป็น array ของ string ในฟิลด์ images
  const images = imagesStr
    .split(",")
    .map((i) => i.trim())
    .filter(Boolean);

  // ตรวจสอบผู้ใช้ปัจจุบันเพื่อความปลอดภัยเพิ่ม
  const user = await currentUser();
  if (!user) throw new Error("Not authenticated");

  const profile = await db.profile.findUnique({
    where: { clerkId: user.id },
  });
  if (!profile) throw new Error("No Profile found for current user");

  // หาโพสต์ที่ต้องการอัปเดต
  const existingPost = await db.post.findUnique({
    where: { id: postId },
  });
  if (!existingPost) throw new Error("Post not found");
  if (existingPost.profileId !== profile.id) {
    throw new Error("You are not the owner of this post");
  }

  // ทำการอัปเดต
  const updatedPost = await db.post.update({
    where: { id: postId },
    data: {
      name,
      description,
      price,
      condition,
      images,
    },
  });

  return updatedPost;
}
