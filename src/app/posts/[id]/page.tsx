// src/app/posts/[id]/page.tsx

import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { fetchPostDetail, fetchUserItems } from "./actions";
import PostDetailClient from "./PostDetailClient";

// กำหนด interface สำหรับรายละเอียดของโพสต์
interface PostDetailType {
  id: string;
  name: string;
  description: string;
  images: string[];
  province: string;
  lat?: number;
  lng?: number;
  price: number;
  condition: string;
  createdAt: string;
  updatedAt: string;
  views: number;
  tags?: string | null;
  profile: {
    id: string;
    clerkId: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string | null;
    profileImage: string | null;
  };
  category: { id: string; name: string } | null;
  status: string;
  comments: {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    profile: {
      id: string;
      firstName: string;
      lastName: string;
      profileImage: string | null;
    };
    postId: string;
  }[];
}

// กำหนด type ของ props โดยระบุว่า params เป็น Promise ของ object ที่มี id เป็น string
interface PostDetailProps {
  params: Promise<{ id: string }>;
}

// หน้า PostDetail เป็น async component ที่รอค่า params ก่อนใช้งาน
export default async function PostDetail({ params }: PostDetailProps) {
  // รอให้ params ถูก resolve เพื่อดึงค่า id
  const { id } = await params;

  // ดึงข้อมูลโพสต์จากฐานข้อมูลตาม id ที่ได้รับ
  const post = await fetchPostDetail({ id });
  if (!post) {
    notFound();
  }

  // ดึงข้อมูลผู้ใช้งานปัจจุบัน
  const user = await currentUser();
  const currentUserId = user?.id;

  // ดึงรายการโพสต์ของผู้ใช้งาน (สำหรับการแลกเปลี่ยน เป็นต้น)
  const userItems = await fetchUserItems();

  // แปลงข้อมูลจากฐานข้อมูลให้ตรงกับ interface PostDetailType
  const transformedPost: PostDetailType = {
    id: post.id,
    name: post.name,
    description: post.description,
    images:
      post.images && post.images.length > 0 ? post.images : ["/default-image.jpg"],
    province: post.province,
    lat: post.lat ?? undefined,
    lng: post.lng ?? undefined,
    price: post.price,
    condition: post.condition,
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    views: post.views,
    tags: post.tags,
    profile: post.profile || {
      id: post.profileId,
      clerkId: "",
      firstName: "",
      lastName: "",
      userName: "",
      email: null,
      profileImage: "/default-profile.png",
    },
    category: post.categoryId ? { id: post.categoryId, name: "" } : null,
    status: post.status,
    comments: (post.comments || []).map((c) => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      profile: {
        id: c.profile.id,
        firstName: c.profile.firstName,
        lastName: c.profile.lastName,
        profileImage: c.profile.profileImage || "/default-profile.png",
      },
      postId: c.postId,
    })),
  };

  // ส่งข้อมูลไปยัง client component เพื่อ render หน้าโพสต์
  return (
    <PostDetailClient
      post={transformedPost}
      currentUserId={currentUserId}
      userItems={userItems}
    />
  );
}
