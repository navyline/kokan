"use client";

import React from "react";
import toast from "react-hot-toast";
import { hidePost, deletePost } from "@/app/actions/adminActions";

interface PostType {
  id: string;
  createdAt: Date;
  name: string;
  status: string;
  // ถ้ามีรูปภาพ => images: string[];
}

interface PostManagementProps {
  posts: PostType[];
  setPosts: React.Dispatch<React.SetStateAction<PostType[]>>;
}

export default function PostManagement({ posts, setPosts }: PostManagementProps) {
  const handleHidePost = async (postId: string) => {
    try {
      await hidePost(postId);
      toast.success("ซ่อนโพสต์สำเร็จ");
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, status: "CLOSED" } : p))
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "เกิดข้อผิดพลาดในการซ่อนโพสต์");
      } else {
        toast.error("เกิดข้อผิดพลาดในการซ่อนโพสต์");
      }
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("คุณแน่ใจหรือว่าต้องการลบโพสต์นี้?")) return;
    try {
      await deletePost(postId);
      toast.success("ลบโพสต์สำเร็จ");
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "เกิดข้อผิดพลาดในการลบโพสต์");
      } else {
        toast.error("เกิดข้อผิดพลาดในการลบโพสต์");
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <h2 className="text-xl font-bold text-gray-700">
        โพสต์ทั้งหมด ({posts.length})
      </h2>
      <div className="border-t pt-3 space-y-3 max-h-80 overflow-auto">
        {posts.map((post) => (
          <div
            key={post.id}
            className="border border-gray-200 rounded p-3 hover:shadow-sm transition"
          >
            <p className="font-semibold text-gray-800">{post.name}</p>
            <p className="text-sm text-gray-500 mt-1">
              สถานะ: {post.status} |{" "}
              {new Date(post.createdAt).toLocaleDateString("th-TH")}
            </p>
            {/* ถ้ามีรูป => <img src={post.images[0]} alt="..." className="mt-2 w-32 h-32 object-cover" /> */}
            <div className="mt-2 flex gap-2">
              {post.status !== "CLOSED" && (
                <button
                  onClick={() => handleHidePost(post.id)}
                  className="px-2 py-1 text-sm bg-yellow-100 text-yellow-800 rounded"
                >
                  ซ่อน
                </button>
              )}
              <button
                onClick={() => handleDeletePost(post.id)}
                className="px-2 py-1 text-sm bg-red-100 text-red-800 rounded"
              >
                ลบ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
