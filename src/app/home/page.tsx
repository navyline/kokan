"use client";

import { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";
import { fetchPostsAction } from "./actions";

// กำหนดชนิดข้อมูลสำหรับโพสต์
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
  const [posts, setPosts] = useState<Post[]>([]); // กำหนดชนิดข้อมูลให้กับ state

  useEffect(() => {
    const fetchPosts = async () => {
      const postsData = await fetchPostsAction(); // เรียกใช้ Action
      setPosts(postsData);
    };

    fetchPosts();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Your Feed</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
