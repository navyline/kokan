import { prisma } from "@/utils/db";

export async function createPost(data: {
  name: string;
  description: string;
  price: number;
  categoryId: string;
  profileId: string;
}) {
  return await prisma.post.create({
    data,
  });
}

export async function getPostById(id: string) {
  return await prisma.post.findUnique({
    where: { id },
    include: { profile: true, category: true },
  });
}
