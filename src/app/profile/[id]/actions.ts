"use server";

import db from "@/utils/db";

/**
 * ดึงข้อมูลโปรไฟล์จาก DB
 */
export async function getProfileById(profileId: string) {
  return db.profile.findUnique({
    where: { id: profileId },
    include: {
      posts: true, // ดึงโพสต์ของ user ด้วย
      followers: true, // คนที่ติดตาม user นี้
      following: true, // user นี้ติดตามใครบ้าง
      blockedUsers: true,
      isBlockedBy: true,
    },
  });
}

/**
 * ดึง Posts ของ user ตาม profileId
 * (จริง ๆ อาจใช้ profile.posts ได้เลย แต่เผื่ออยากเขียนแยกก็ทำได้)
 */
export async function getPostsByProfile(profileId: string) {
  return db.post.findMany({
    where: { profileId },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * กด Follow
 * สมมติว่า currentUserProfileId คือโปรไฟล์ของคนกด follow
 * ส่วน targetProfileId คือโปรไฟล์ที่ถูก follow
 */
export async function followUser(currentUserProfileId: string, targetProfileId: string) {
  // เช็กก่อนว่า record นี้มีอยู่แล้วหรือไม่
  const existing = await db.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: currentUserProfileId,
        followingId: targetProfileId,
      },
    },
  });
  if (!existing) {
    await db.follow.create({
      data: {
        followerId: currentUserProfileId,
        followingId: targetProfileId,
      },
    });
  }
  return true;
}

/**
 * ยกเลิก Follow (Unfollow)
 */
export async function unfollowUser(currentUserProfileId: string, targetProfileId: string) {
  await db.follow.delete({
    where: {
      followerId_followingId: {
        followerId: currentUserProfileId,
        followingId: targetProfileId,
      },
    },
  });
  return true;
}

/**
 * บล็อก user
 */
export async function blockUser(currentUserProfileId: string, targetProfileId: string) {
  const existing = await db.block.findUnique({
    where: {
      blockerId_blockedId: {
        blockerId: currentUserProfileId,
        blockedId: targetProfileId,
      },
    },
  });
  if (!existing) {
    await db.block.create({
      data: {
        blockerId: currentUserProfileId,
        blockedId: targetProfileId,
      },
    });
  }
  return true;
}

/**
 * ยกเลิก Block
 */
export async function unblockUser(currentUserProfileId: string, targetProfileId: string) {
  await db.block.delete({
    where: {
      blockerId_blockedId: {
        blockerId: currentUserProfileId,
        blockedId: targetProfileId,
      },
    },
  });
  return true;
}

