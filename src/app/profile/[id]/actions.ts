"use server";

import db from "@/utils/db";

/**
 * ดึงข้อมูลโปรไฟล์จากฐานข้อมูล
 */
export async function getProfileById(profileId: string) {
  return db.profile.findUnique({
    where: { id: profileId },
    include: {
      posts: true,
      followers: true,
      following: true,
      blockedUsers: true,
      isBlockedBy: true,
    },
  });
}

/**
 * กด Follow ผู้ใช้งาน
 */
export async function followUser(currentUserProfileId: string, targetProfileId: string) {
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
 * บล็อกผู้ใช้งาน
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
 * ยกเลิก Block ผู้ใช้งาน
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
