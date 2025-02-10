import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { fetchPostDetail, fetchUserItems } from "./actions";
import PostDetailClient from "./PostDetailClient";

interface PostDetailProps {
  params: {
    id: string;
  };
}

export default async function PostDetail({ params }: PostDetailProps) {
  // ดึง params (ใช้ await ตามที่ระบุ)
  const { id } = await params;

  // 1) ดึงข้อมูลโพสต์จาก DB
  const post = await fetchPostDetail({ id });
  if (!post) {
    notFound();
  }

  // 2) ดึงข้อมูล user ปัจจุบัน
  const user = await currentUser();
  const currentUserId = user?.id;

  // 3) ดึงรายการโพสต์ของ user
  const userItems = await fetchUserItems();

  // 4) แปลงข้อมูล post ก่อนส่งให้ Client Component
  const transformedPost = {
    id: post.id,
    name: post.name,
    description: post.description,
    // หากไม่มีรูปหรือเป็น array ว่าง ให้ใช้ default image
    images: post.images && post.images.length > 0 ? post.images : ["/default-image.jpg"],
    province: post.province,
    lat: post.lat ?? undefined,
    lng: post.lng ?? undefined,
    price: post.price,
    createdAt: post.createdAt.toISOString(),
    profile: {
      id: post.profile?.id ?? "",
      firstName: post.profile?.firstName ?? "",
      lastName: post.profile?.lastName ?? "",
      profileImage: post.profile?.profileImage ?? undefined,
    },
    comments: (post.comments || []).map((c) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
      profile: {
        ...c.profile,
        profileImage: c.profile?.profileImage ?? undefined,
      },
    })),
  };

  return (
    <PostDetailClient
      post={transformedPost}
      currentUserId={currentUserId}
      userItems={userItems}
    />
  );
}
