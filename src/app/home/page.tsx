"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PostCard from "@/components/PostCard";
import { fetchPostsAction, fetchCategories } from "./actions";
import { Post } from "@/utils/types";

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  // ดึงข้อมูล Posts และ Categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // หากต้องการให้มีการค้นหาด้วย searchQuery ด้วย
        // ให้เพิ่มการส่ง searchQuery ไปใน fetchPostsAction ได้
        const postsData = await fetchPostsAction(selectedCategory);
        setPosts(postsData);

        const categoriesData = await fetchCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchQuery, selectedCategory]);

  // ฟังก์ชันเปลี่ยน Category
  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-6 max-w-7xl">
        {/* ส่วนหัวข้อ */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
          {searchQuery ? `Results for "${searchQuery}"` : "Trending Posts"}
        </h1>

        {/* คำอธิบายเล็ก ๆ ด้านล่างหัวข้อ ถ้าอยากให้มี */}
        <p className="text-center text-gray-600 mb-10">
          เลือกหมวดหมู่ที่ต้องการ หรือเริ่มค้นหาเพื่อดูโพสต์ทั้งหมด
        </p>

        {/* แสดงเมนูประเภท (Categories) แบบปุ่ม */}
        <div className="flex gap-4 justify-center mb-8 flex-wrap">
          {/* ปุ่ม All */}
          <button
            onClick={() => handleCategoryClick(null)}
            className={`px-4 py-2 rounded-full text-sm border transition 
              ${
                selectedCategory === null
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
              }`}
          >
            All
          </button>
          {/* ปุ่ม Category */}
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`px-4 py-2 rounded-full text-sm border transition 
                ${
                  selectedCategory === category.id
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* ส่วนแสดง Posts หรือ Skeleton Loading */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="h-56 bg-gray-200 animate-pulse rounded-xl"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {posts.length > 0 ? (
              posts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                {searchQuery
                  ? "No results found."
                  : "No posts available."}
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
