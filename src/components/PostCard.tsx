"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { CheckCircle } from "lucide-react";
import { Post } from "@/utils/types";

export default function PostCard({ post }: { post: Post }) {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  const mainImage =
    post.images && post.images.length > 0 ? post.images[0] : "/default-image.png";

  // ตรวจสอบว่า Verified หรือไม่
  const isVerified = (post.profile as { verification?: { status: string } })?.verification?.status === "APPROVED";

  return (
    <div className="relative border border-gray-200 rounded-xl shadow-lg bg-white overflow-hidden transition-transform transform hover:scale-105 hover:shadow-xl">
      <div className="relative group w-full h-52">
        <Link href={`/posts/${post.id}`}>
          <Image src={mainImage} alt={post.name} fill className="object-cover" />
        </Link>

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

      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-900 truncate">
          <Link href={`/posts/${post.id}`}>
            <span className="hover:underline cursor-pointer">{post.name}</span>
          </Link>
        </h2>

        {post.profile ? (
          <div className="flex items-center mt-3">
            <Image
              src={post.profile.profileImage ?? "/default-profile.png"}
              alt={`${post.profile.firstName} ${post.profile.lastName}`}
              className="w-10 h-10 rounded-full border border-gray-300 shadow-xs"
              width={40}
              height={40}
            />

            <Link
              href={`/profile/${post.profile.id}`}
              className="ml-3 flex items-center"
            >
              <span className="text-sm font-medium text-gray-700 hover:text-gray-900 transition">
                {post.profile.firstName} {post.profile.lastName}
              </span>
              {isVerified && (
                <div className="ml-1 relative group inline-flex items-center">
                  <CheckCircle
                    className="text-blue-500"
                    size={16}
                    aria-label="Verified"
                  />
                  <div
                    className="absolute hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap"
                    style={{ minWidth: "100px" }}
                  >
                    บัญชีนี้ผ่านการยืนยันตัวตน
                  </div>
                </div>
              )}
            </Link>
          </div>
        ) : (
          <div className="mt-3 text-gray-500 text-sm"> </div>
        )}
      </div>
    </div>
  );
}
