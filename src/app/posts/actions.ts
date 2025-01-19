"use server";

import db from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";

export const fetchPosts = async () => {
  const user = await currentUser();

  const posts = await db.post.findMany({
    include: {
      favorites: user
        ? {
            where: { profileId: user.id },
            select: { id: true },
          }
        : false,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return posts.map((post) => ({
    ...post,
    isFavorited: post.favorites?.length > 0,
  }));
};

export const toggleFavoriteAction = async ({
  postId,
  isFavorited,
}: {
  postId: string;
  isFavorited: boolean;
}) => {
  const user = await currentUser();
  if (!user) {
    throw new Error("You must be logged in to favorite a post.");
  }

  if (isFavorited) {
    // Remove favorite
    await db.favorite.deleteMany({
      where: {
        postId,
        profileId: user.id,
      },
    });
  } else {
    // Add favorite
    await db.favorite.create({
      data: {
        postId,
        profileId: user.id,
      },
    });
  }
};
