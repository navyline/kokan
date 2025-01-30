import { fetchPostDetail } from "./actions";
import PostDetailClient from "./PostDetailClient";

interface PostDetailProps {
  params: Promise<{ id: string }>; // ✅ ระบุให้ params เป็น Promise
}

export default async function PostDetail({ params }: PostDetailProps) {
  const resolvedParams = await params; // ✅ ใช้ await เพื่อ resolve ค่า
  const { id } = resolvedParams; 

  const post = await fetchPostDetail({ id });

  if (!post) {
    return <p>Post not found</p>;
  }

  const transformedPost = {
    id: post.id,
    name: post.name,
    description: post.description,
    image: post.image ?? undefined,
    categoryId: post.categoryId ?? undefined,
    condition: post.condition ?? undefined,
    profileId: post.profileId,
    lat: post.lat ?? undefined,
    lng: post.lng ?? undefined
  };

  return <PostDetailClient post={transformedPost} />;
}
