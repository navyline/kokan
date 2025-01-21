"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

type Post = {
  id: string;
  name: string;
  image?: string | null;
  profile?: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string | null;
  };
};

export default function PostCard({ post }: { post: Post }) {
  const [isFavorited, setIsFavorited] = useState(false);
  const handleFavoriteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
  };

  return (
    <div className="relative border border-gray-200 rounded-lg shadow-md overflow-hidden bg-white transition hover:shadow-lg">
      {post.image && (
        <div className="relative group w-full h-48">
          <Link href={`/posts/${post.id}`}>
            <Image src={post.image} alt={post.name} fill className="object-cover" />
          </Link>
          <button
            onClick={handleFavoriteClick}
            className={`absolute top-2 right-2 bg-white p-2 rounded-full shadow-md transition transform ${
              isFavorited ? "text-red-500" : "text-gray-500"
            } group-hover:opacity-100 opacity-0`}
            aria-label={isFavorited ? "Unfavorite" : "Favorite"}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5c0-2.58 2.42-5 5.5-5 1.74 0 
                       3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3c3.08 0 
                       5.5 2.42 5.5 5 0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>
        </div>
      )}

      <div className="p-4">
        <h2 className="text-md font-semibold text-gray-900 truncate">
          <Link href={`/posts/${post.id}`}>
            <span className="hover:underline cursor-pointer">{post.name}</span>
          </Link>
        </h2>
        {post.profile ? (
          <div className="flex items-center mt-3">
            <Image
              src={post.profile.profileImage || "/default-profile.png"}
              alt={`${post.profile.firstName} ${post.profile.lastName}`}
              className="w-8 h-8 rounded-full border border-gray-300"
              width={32}
              height={32}
            />
            <Link href={`/profile/${post.profile.id}`}>
              <span className="ml-2 text-sm font-medium text-gray-700 hover:underline cursor-pointer">
                {post.profile.firstName} {post.profile.lastName}
              </span>
            </Link>
          </div>
        ) : (
          <div className="mt-3 text-gray-500 text-sm">(No owner profile)</div>
        )}
      </div>
    </div>
  );
}
