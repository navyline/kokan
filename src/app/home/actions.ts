"use server"

import db from "@/utils/db";

type Post = {
  id: string;
  name: string;
  image?: string;
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string;
  };
};

export async function fetchPostsAction(): Promise<Post[]> {
  try {
    const posts = await db.post.findMany({
      include: {
        profile: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    return posts.map((post) => ({
      id: post.id,
      name: post.name,
      image: post.image || undefined,
      profile: {
        id: post.profile.id,
        firstName: post.profile.firstName,
        lastName: post.profile.lastName,
        profileImage: post.profile.profileImage || undefined,
      },
    }));
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("Failed to fetch posts");
  }
}
