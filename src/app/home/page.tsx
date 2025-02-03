"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PostCard from "@/components/PostCard";
import { fetchPostsAction, fetchCategories } from "./actions";
import { ChevronDown } from "lucide-react";
import { Post } from "@/utils/types"; 

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const postsData = await fetchPostsAction(selectedCategory);
        setPosts(postsData);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCategoriesData = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchPosts();
    fetchCategoriesData();
  }, [searchQuery, selectedCategory]);

  return (
    <main className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-6 max-w-7xl">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
          {searchQuery ? `🔍 Results for "${searchQuery}"` : "🔥 Trending Posts"}
        </h1>

        {/* Dropdown เลือก Category */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <select
              onChange={(e) => setSelectedCategory(e.target.value)}
              value={selectedCategory || ""}
              className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">📌 All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute top-2 right-3 text-gray-500" />
          </div>
        </div>

        {/* แสดง Skeleton Loading */}
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
                {searchQuery ? "❌ No results found 😕" : "⚠️ No posts available"}
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
