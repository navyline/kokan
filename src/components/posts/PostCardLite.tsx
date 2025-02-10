"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaHeart, FaCommentAlt } from "react-icons/fa";
import { Post } from "@/utils/types"; // ใช้ Type ที่แก้ไขแล้วจากไฟล์กลาง

export default function PostCard({ post }: { post: Post }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  // เลือกรูปภาพแรกจาก Array หรือใช้ default image
  const mainImage =
    post.images && post.images.length > 0 ? post.images[0]: "/default-image.png";

  return (
    <div
      className="relative w-56 sm:w-64 bg-white rounded-2xl shadow-md overflow-hidden transition-transform hover:scale-105 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* รูปสินค้า */}
      <div className="relative w-full h-56">
        <Link href={`/posts/${post.id}`}>
          <Image
            src={mainImage} // ใช้ mainImage ที่เลือกมา
            alt={post.name}
            fill
            className="object-cover transition-opacity duration-300"
          />
        </Link>

        {/* สถานะสินค้า (เช่น PENDING) */}
        {post.status && (
          <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-md shadow">
            {post.status}
          </div>
        )}

        {/* ปุ่ม Favorite บนรูป (แสดงเมื่อ hover) */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-2 right-2 bg-white p-2 rounded-full shadow-md transition-transform ${isHovered ? "opacity-100" : "opacity-0"} ${isFavorited ? "text-red-500" : "text-gray-400"}`}
          aria-label={isFavorited ? "Unfavorite" : "Favorite"}
        >
          <FaHeart className="w-5 h-5" />
        </button>
      </div>

      {/* ส่วนข้อมูลโพสต์ */}
      <div className="p-4 text-center">
        {/* ชื่อโพสต์ (แสดงเมื่อ hover) */}
        <h2 className={`text-sm font-semibold text-gray-800 transition-opacity ${isHovered ? "opacity-100" : "opacity-0"}`}>
          <Link href={`/posts/${post.id}`} className="hover:underline">
            {post.name}
          </Link>
        </h2>

        {/* จำนวน Favorite & Comments */}
        <div className="flex justify-center items-center gap-3 text-xs text-gray-600 mt-2">
          <div className="flex items-center gap-1">
            <FaHeart className="text-red-400" />
            <span>{post.likesCount ?? 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <FaCommentAlt className="text-blue-400" />
            <span>{post.commentsCount ?? 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
