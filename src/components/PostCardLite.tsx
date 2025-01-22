"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type PostLite = {
  id: string;
  name: string;
  image?: string | null;
  likesCount?: number;
  commentsCount?: number;
  status?: string;
};

export default function PostCardLite({ post }: { post: PostLite }) {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="border rounded-lg shadow bg-white p-4 w-60 flex flex-col gap-2 relative">
      {/* รูปสินค้า พร้อม Overlay สำหรับ Status */}
      <div className="relative w-full h-36 overflow-hidden rounded">
        {post.image && (
          <Link href={`/posts/${post.id}`}>
            <Image
              src={post.image}
              alt={post.name}
              fill
              className="object-cover"
            />
          </Link>
        )}
        {/* สถานะ (ถ้ามี) อยู่บนรูป */}
        {post.status === "PENDING" && (
          <div
            className="absolute top-0 left-0 bg-pink-200 text-pink-600 
                        px-2 py-1 rounded-bl-md text-sm z-10"
          >
            Trade Pending
          </div>
        )}
      </div>

      {/* ชื่อโพสต์ */}
      <h2 className="text-sm font-semibold">
        <Link href={`/posts/${post.id}`}>
          <span className="hover:underline">{post.name}</span>
        </Link>
      </h2>

      {/* แสดง likesCount, commentsCount */}
      <div className="flex items-center text-xs text-gray-500 gap-4">
        <span>♥ {post.likesCount ?? 0}</span>
        <span>💬 {post.commentsCount ?? 0}</span>
      </div>

      {/* ปุ่มชอบ (Client Side) */}
      <button
        onClick={handleFavoriteClick}
        className={`mt-auto self-end py-1 px-3 rounded-full text-sm border 
                    ${
                      isFavorited
                        ? "bg-red-50 text-red-500 border-red-200"
                        : "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
      >
        {isFavorited ? "Unfavorite" : "Favorite"}
      </button>
    </div>
  );
}
