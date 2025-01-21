"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

/**
 * หาก Schema Post มีฟิลด์ likes, commentsCount, status, เป็นต้น
 * สามารถเพิ่มใน interface ได้
 */
type PostLite = {
  id: string;
  name: string;
  image?: string | null;
  likesCount?: number;
  commentsCount?: number;
  status?: string;   // เช่น "Trade Pending"
};

export default function PostCardLite({ post }: { post: PostLite }) {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="border rounded-lg shadow bg-white p-4 w-60 flex flex-col gap-2 relative">
      {/* หากมี status เช่น 'Trade Pending' แสดง label */}
      {post.status === "PENDING" && (
        <div className="absolute top-2 left-2 bg-pink-200 text-pink-600 
                        px-2 py-1 rounded text-sm"
        >
          Trade Pending
        </div>
      )}

      {/* รูปสินค้า */}
      {post.image && (
        <div className="relative w-full h-36 overflow-hidden rounded">
          <Link href={`/posts/${post.id}`}>
            <Image 
              src={post.image} 
              alt={post.name} 
              fill 
              className="object-cover" 
            />
          </Link>
        </div>
      )}

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
                    ${isFavorited ? "bg-red-50 text-red-500 border-red-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}
      >
        {isFavorited ? "Unfavorite" : "Favorite"}
      </button>
    </div>
  );
}
