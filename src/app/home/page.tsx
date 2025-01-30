"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PostCard from "@/components/PostCard";
import { fetchPostsAction } from "./actions";

// กำหนดชนิดข้อมูลของโพสต์
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

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || ""; // รับค่าการค้นหาจาก URL

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const postsData = await fetchPostsAction(); // ส่งคำค้นหาไปยังฟังก์ชันดึงข้อมูล
      setPosts(postsData);
      setLoading(false);
    };

    fetchPosts();
  }, [searchQuery]); // รีโหลดเมื่อค่า searchQuery เปลี่ยน

  return (
    <main className="min-h-screen bg-gray-50 pt-24">
      <div className="container max-w-(--breakpoint-xl) mx-auto px-6">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
          {searchQuery ? `Results for "${searchQuery}"` : "Your Feed"}
        </h1>

        {/* แสดง Skeleton Loading เมื่อกำลังโหลด */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="h-56 bg-gray-200 animate-pulse rounded-xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                {searchQuery ? "No results found 😕" : "No posts available"}
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
