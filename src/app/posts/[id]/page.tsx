import { fetchPostDetail } from "./actions";
import PostDetailClient from "./PostDetailClient";
import { currentUser } from "@clerk/nextjs/server";

interface PostDetailProps {
  params: Promise<{ id: string }>; // ✅ เปลี่ยนให้ params เป็น Promise
}

export default async function PostDetail({ params }: PostDetailProps) {
  const resolvedParams = await params; // ✅ รอให้ params resolve ก่อนใช้
  const { id } = resolvedParams;

  const post = await fetchPostDetail({ id });

  if (!post) {
    return <p>Post not found</p>;
  }

  // ✅ ดึงข้อมูล User ปัจจุบันจาก Clerk
  const user = await currentUser();
  const currentUserId = user?.id ?? undefined;

  const transformedPost = {
    id: post.id,
    name: post.name,
    description: post.description,
    image: post.image ?? undefined,
    province: post.province,
    lat: post.lat ?? undefined,
    lng: post.lng ?? undefined,
    price: post.price,
    createdAt: post.createdAt.toISOString(),
    profile: {
      id: post.profile.id,
      firstName: post.profile.firstName,
      lastName: post.profile.lastName,
      profileImage: post.profile.profileImage ?? undefined
    },
    comments: (post.comments || []).map(comment => ({
      ...comment,
      createdAt: comment.createdAt.toISOString(),
      profile: {
        ...comment.profile,
        profileImage: comment.profile.profileImage ?? undefined
      }
    }))
  };

  return <PostDetailClient post={transformedPost} currentUserId={currentUserId} />;
}
