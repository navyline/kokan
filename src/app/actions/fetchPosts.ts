import db from "@/utils/db";

export async function fetchPostsAction(searchQuery: string | null) {
  return await db.post.findMany({
    where: searchQuery
      ? {
          OR: [
            { name: { contains: searchQuery, mode: "insensitive" } },
            { description: { contains: searchQuery, mode: "insensitive" } },
          ],
        }
      : {}, // ถ้าไม่มี searchQuery ให้คืนค่าทั้งหมด
    include: {
      profile: true,
    },
  });
}
