"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Post } from "@/utils/types"; // ✅ ใช้ Type จากไฟล์กลาง

export default function PostCard({ post }: { post: Post }) {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  // ✅ เลือกรูปภาพแรกจาก Array หรือใช้ default
  const mainImage = post.images && post.images.length > 0 ? post.images[0] : "/default-image.png";

  return (
    <div className="relative border border-gray-200 rounded-xl shadow-lg bg-white overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl">
      {/* รูปสินค้า */}
      <div className="relative group w-full h-52">
        <Link href={`/posts/${post.id}`}>
          <Image
            src={mainImage} // ✅ ใช้ mainImage แทน
            alt={post.name}
            fill
            className="object-cover"
          />
        </Link>

        {/* ปุ่ม Favorite */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 right-2 bg-white p-3 rounded-full shadow-md transition hover:bg-red-100"
          aria-label={isFavorited ? "Unfavorite" : "Favorite"}
        >
          {isFavorited ? (
            <FaHeart className="text-red-500 w-5 h-5" />
          ) : (
            <FaRegHeart className="text-gray-500 w-5 h-5" />
          )}
        </button>
      </div>

      {/* ข้อมูลสินค้า */}
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 truncate">
          <Link href={`/posts/${post.id}`}>
            <span className="hover:underline cursor-pointer">{post.name}</span>
          </Link>
        </h2>

        {/* ข้อมูลเจ้าของโพสต์ */}
        {post.profile ? (
          <div className="flex items-center mt-3">
            <Image
              src={post.profile.profileImage ?? "/default-profile.png"} // ✅ ป้องกัน null
              alt={`${post.profile.firstName} ${post.profile.lastName}`}
              className="w-10 h-10 rounded-full border border-gray-300 shadow-xs"
              width={40}
              height={40}
            />
            <Link href={`/profile/${post.profile.id}`}>
              <span className="ml-3 text-sm font-medium text-gray-700 hover:text-gray-900 transition">
                {post.profile.firstName} {post.profile.lastName}
              </span>
            </Link>
          </div>
        ) : (
          <div className="mt-3 text-gray-500 text-sm"></div>
        )}
      </div>
    </div>
  );
}
