"use server";

import db from "@/utils/db";

export async function fetchUsers() {
  return await db.profile.findMany({
    select: {
      id: true,
      userName: true,
      email: true,
      role: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function updateUserRole(userId: string, role: "ADMIN" | "USER") {
  return await db.profile.update({
    where: { id: userId },
    data: { role },
  });
}

export async function deleteUser(userId: string) {
  return await db.profile.delete({
    where: { id: userId },
  });
}

export async function fetchPosts() {
    return await db.post.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
  
  export async function hidePost(postId: string) {
    return await db.post.update({
      where: { id: postId },
      data: { status: "CLOSED" }, // เปลี่ยนสถานะเป็นซ่อน
    });
  }
  
  export async function deletePost(postId: string) {
    return await db.post.delete({
      where: { id: postId },
    });
  }

  export async function fetchVerifications() {
    return await db.verification.findMany({
      where: { status: "PENDING" },
      select: {
        id: true,
        userId: true,
        documentUrl: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }
  
  export async function approveVerification(verificationId: string) {
    return await db.verification.update({
      where: { id: verificationId },
      data: { status: "APPROVED" },
    });
  }
  
  export async function rejectVerification(verificationId: string) {
    return await db.verification.update({
      where: { id: verificationId },
      data: { status: "REJECTED" },
    });
  }
  