"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaHeart, FaCommentAlt } from "react-icons/fa";

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
    <div className="border border-gray-200 rounded-xl shadow-md bg-white p-4 w-64 flex flex-col gap-3 transition-transform transform hover:scale-105 hover:shadow-lg">
      {/* รูปสินค้า พร้อม Overlay สำหรับ Status */}
      <div className="relative w-full h-40 overflow-hidden rounded-lg">
        {post.image && (
          <Link href={`/posts/${post.id}`}>
            <Image src={post.image} alt={post.name} fill className="object-cover z-0" />
          </Link>
        )}
        {/* สถานะสินค้า */}
        {post.status === "PENDING" && (
          <div className="absolute top-2 left-2 bg-pink-200 text-pink-700 px-2 py-1 z-10 rounded-md text-xs font-medium shadow">
            Trade Pending
          </div>
        )}
      </div>

      {/* ชื่อโพสต์ */}
      <h2 className="text-md font-semibold text-gray-800 truncate">
        <Link href={`/posts/${post.id}`} className="hover:underline">
          {post.name}
        </Link>
      </h2>

      {/* แสดง likesCount, commentsCount */}
      <div className="flex items-center text-xs text-gray-600 gap-3">
        <div className="flex items-center gap-1">
          <FaHeart className="text-red-400" />
          <span>{post.likesCount ?? 0}</span>
        </div>
        <div className="flex items-center gap-1">
          <FaCommentAlt className="text-blue-400" />
          <span>{post.commentsCount ?? 0}</span>
        </div>
      </div>

      {/* ปุ่ม Favorite */}
      <button
        onClick={handleFavoriteClick}
        className={`mt-auto py-2 px-4 rounded-lg text-sm font-medium transition ${
          isFavorited
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
        }`}
      >
        {isFavorited ? "Unfavorite" : "Favorite"}
      </button>
    </div>
  );
}
