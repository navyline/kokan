"use client";

import { useTransition } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { FaCommentDots, FaMapMarkerAlt } from "react-icons/fa";
import Breadcrums from "@/components/posts/Breadcrums";
import FavoriteToggleButton from "@/components/posts/FavoriteToggleButton";
import ShareButton from "@/components/posts/ShareButton";

// โหลด MapLandmark เฉพาะ Client-Side
const MapLandmark = dynamic(() => import("@/components/map/Map"), { ssr: false });

interface PostDetailClientProps {
  post: {
    id: string;
    name: string;
    description: string;
    image?: string;
    categoryId?: string;
    condition?: string;
    profileId: string; // เจ้าของโพสต์
    lat?: number;
    lng?: number;
  };
  currentUserId?: string;
}

export default function PostDetailClient({ post, currentUserId }: PostDetailClientProps) {

  const [isPending] = useTransition();

  // เช็คว่า user ปัจจุบันคือเจ้าของโพสต์หรือไม่
  const isOwner = currentUserId === post.profileId;



  return (
    <section className="p-4 md:p-8 bg-blue-50 min-h-screen">
      <Breadcrums name={post.name} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* ภาพสินค้า + ปุ่ม Favorite / Share */}
        <div className="space-y-4">
          <div className="relative w-full h-60 md:h-80 rounded-xl overflow-hidden shadow-md">
            <Image
              src={post.image || "/default-image.jpg"}
              alt={post.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex justify-between items-center">
            <FavoriteToggleButton postId={post.id} />
            <ShareButton postId={post.id} name={post.name} />
          </div>
        </div>

        {/* ข้อมูลสินค้า */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{post.name}</h1>
          <p className="text-gray-600 mt-2">{post.description}</p>
          <div className="space-y-3 text-sm md:text-base mt-4">
            <p>
              <strong className="text-gray-700">Category:</strong>{" "}
              <span className="text-blue-600">{post.categoryId || "N/A"}</span>
            </p>
            <p>
              <strong className="text-gray-700">Condition:</strong>{" "}
              <span className="text-green-600">{post.condition || "N/A"}</span>
            </p>
          </div>

          {/* ปุ่ม Start Chat ถ้าไม่ใช่เจ้าของโพสต์ */}
          {!isOwner && (
            <button
              className={`mt-6 w-full py-3 rounded-lg shadow-lg text-lg font-semibold flex items-center justify-center gap-2 transition ${
                isPending
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-yellow-400 hover:bg-yellow-500 text-white hover:scale-105"
              }`}
            >
              <FaCommentDots className="text-xl" />
              {isPending ? "Starting Chat..." : "Start Chat"}
            </button>
          )}
        </div>
      </div>

      {/* แสดงแผนที่ถ้ามี lat, lng */}
      {typeof post.lat === "number" && typeof post.lng === "number" && (
        <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800 flex items-center gap-2">
            <FaMapMarkerAlt className="text-red-500" />
            Meeting Spot
          </h2>
          <div className="w-full h-48 md:h-72 rounded-lg overflow-hidden mt-4">
            <MapLandmark location={{ lat: post.lat, lng: post.lng }} />
          </div>
        </div>
      )}

      {/* ส่วน comments */}
      <div className="mt-6 bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-lg md:text-xl font-semibold text-gray-800">Comments</h2>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-400 mt-4"
          placeholder="Write a comment..."
        />
      </div>
    </section>
  );
}
