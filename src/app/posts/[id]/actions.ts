"use server";

import db from "@/utils/db";

export const fetchPostDetail = async ({ id }: { id: string }) => {
  try {
    const post = await db.post.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });

    return post;
  } catch (error) {
    console.error("Error fetching post detail:", error);
    return null;
  }
};
