"use server";

import db from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";

export async function checkAdmin(): Promise<boolean> {
  const user = await currentUser();
  if (!user) return false;

  // ดึง profile จาก db
  const profile = await db.profile.findUnique({
    where: { clerkId: user.id },
  });

  if (!profile) return false;

  // ถ้า role = ADMIN => return true
  return profile.role === "ADMIN";
}

// ตัวอย่างดึงผู้ใช้ทั้งหมด (id, email, userName, role)
export async function fetchUsers() {
  // สมมติว่าดึงจาก Profile
  const users = await db.profile.findMany({
    select: {
      id: true,
      email: true,
      userName: true,
      role: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return users;
}

// ดึงโพสต์ทั้งหมด
export async function fetchPosts() {
  const posts = await db.post.findMany({
    select: {
      id: true,
      name: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return posts;
}

// ดึงคำขอยืนยันตัวตน
export async function fetchVerifications() {
  const verifications = await db.verification.findMany({
    select: {
      id: true,
      userId: true,
      documentUrl: true,
      phone: true,
      address: true,
    },
    where: {
      status: "PENDING",
    },
    orderBy: { createdAt: "desc" },
  });
  return verifications;
}

// ตัวอย่างอัปเดต Role ของ User
export async function updateUserRole(userId: string, role: "ADMIN" | "USER") {
  await db.profile.update({
    where: { id: userId },
    data: { role },
  });
  return true;
}

// ตัวอย่างลบ user
export async function deleteUser(userId: string) {
  await db.profile.delete({
    where: { id: userId },
  });
  return true;
}

// ซ่อนโพสต์ (status -> CLOSED)
export async function hidePost(postId: string) {
  await db.post.update({
    where: { id: postId },
    data: { status: "CLOSED" },
  });
  return true;
}

// ลบโพสต์
export async function deletePost(postId: string) {
  await db.post.delete({
    where: { id: postId },
  });
  return true;
}

// อนุมัติคำขอ Verification
export async function approveVerification(verificationId: string) {
  // สมมติว่า id ของ verification คือ id ของ row, ไม่ใช่ userId
  await db.verification.update({
    where: { id: verificationId },
    data: { status: "APPROVED" },
  });
  return true;
}

// ปฏิเสธคำขอ
export async function rejectVerification(verificationId: string) {
  await db.verification.update({
    where: { id: verificationId },
    data: { status: "REJECTED" },
  });
  return true;
}
