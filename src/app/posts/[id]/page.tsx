import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { fetchPostDetail, fetchUserItems } from "./actions";
import PostDetailClient from "./PostDetailClient";

// กำหนด interface สำหรับโพสต์ที่มีรายละเอียดครบถ้วน
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
  category: { id: string; name: string } | null; // Ensure this matches PostType
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

interface PostDetailProps {
  params: { id: string };
}

export default async function PostDetail({ params }: PostDetailProps) {
  const { id } = params;
  const post = await fetchPostDetail({ id });
  if (!post) {
    notFound();
  }

  // ดึงข้อมูล user ปัจจุบัน
  const user = await currentUser();
  const currentUserId = user?.id;

  // ดึงรายการโพสต์ของ user (สำหรับการเสนอแลกเปลี่ยน)
  const userItems = await fetchUserItems();

  // แปลงข้อมูลจากฐานข้อมูลให้ตรงกับ PostDetailType
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
    condition: post.condition, // Assumes post.condition exists from the DB
    createdAt: post.createdAt.toISOString(),
    updatedAt: post.updatedAt.toISOString(),
    views: post.views,
    tags: post.tags,
    // หาก query include relation profile แล้ว จะมีข้อมูลใน post.profile; หากไม่ ให้ fallback โดยใช้ post.profileId
    profile: post.profile || {
      id: post.profileId,
      clerkId: "",
      firstName: "",
      lastName: "",
      userName: "",
      email: null,
      profileImage: "/default-profile.png",
    },
    // สำหรับ category: หากไม่มีข้อมูลใน post.category ให้ fallback โดยใช้ post.categoryId
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

  return (
    <PostDetailClient
      post={transformedPost}
      currentUserId={currentUserId}
      userItems={userItems}
    />
  );
}
