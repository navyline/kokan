"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useState, useTransition } from "react";
import {
  FaMapMarkerAlt,
  FaClock,
  FaHeart,
  FaExchangeAlt,
  FaCog,
} from "react-icons/fa";
import Link from "next/link";
import { formatDistance } from "date-fns/formatDistance";
import { enUS } from "date-fns/locale";

import { addComment, toggleFavorite, makeTradeOffer } from "./actions";

// Lazy load แผนที่
const MapLandmark = dynamic(() => import("@/components/map/Map"), { ssr: false });

// Interfaces
interface ProfileInfo {
  id: string;
  firstName: string;
  lastName: string;
  profileImage?: string | null;
}

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  profile: ProfileInfo;
}

interface PostType {
  id: string;
  name: string;
  description: string;
  images: string[];
  province: string;
  lat?: number;
  lng?: number;
  price: number;
  createdAt?: string;
  profile: ProfileInfo;
  comments: Comment[];
  category?: {
    name: string;
  };
  condition: string;
}

interface UserItem {
  id: string;
  name: string;
}

// Props ที่รับเข้ามาใน Client Component
interface PostDetailClientProps {
  post: PostType;
  currentUserId?: string;
  userItems?: UserItem[];
}

export default function PostDetailClient({
  post,
  currentUserId,
  userItems = [],
}: PostDetailClientProps) {
  // เช็คว่าเป็นเจ้าของโพสต์หรือไม่
  const isOwner = currentUserId === post.profile.id;

  // แปลงเวลา (date-fns)
  const formattedTime =
    post.createdAt && !isNaN(new Date(post.createdAt).getTime())
      ? formatDistance(new Date(post.createdAt), new Date(), {
          addSuffix: true,
          locale: enUS,
        })
      : "Unknown time";

  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [isFavorite, setIsFavorite] = useState(false);
  const [offerSent, setOfferSent] = useState(false);
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [selectedOfferedPostId, setSelectedOfferedPostId] = useState("");

  const [isPending, startTransition] = useTransition();

  // state สำหรับ Image Carousel
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleNextImage = () => {
    if (currentImageIndex < post.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = () => {
    startTransition(async () => {
      try {
        const result = await toggleFavorite({ postId: post.id });
        setIsFavorite(result.isFavorite);
      } catch (error) {
        console.error("Error toggling favorite:", error);
      }
    });
  };

  // เปิด Modal Make an Offer
  const handleOpenOfferModal = () => {
    if (isOwner) return;
    setIsOfferModalOpen(true);
  };

  // ส่งฟอร์ม Offer
  const handleSubmitOffer = () => {
    if (!selectedOfferedPostId) {
      alert("Please select an item to offer");
      return;
    }
    startTransition(async () => {
      try {
        await makeTradeOffer({
          postId: post.id,
          offeredPostId: selectedOfferedPostId,
        });
        setOfferSent(true);
        setIsOfferModalOpen(false);
      } catch (error) {
        console.error("Trade offer failed:", error);
      }
    });
  };

  // เพิ่มคอมเมนต์
  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;

    startTransition(async () => {
      try {
        const createdComment = await addComment({
          postId: post.id,
          content: newComment,
        });
        setComments((prev) => [
          {
            ...createdComment,
            createdAt: new Date(createdComment.createdAt).toISOString(),
            profile: {
              ...createdComment.profile,
              profileImage:
                createdComment.profile.profileImage ?? "/default-profile.png",
            },
          },
          ...prev,
        ]);
        setNewComment("");
      } catch (error) {
        console.error("Failed to add comment:", error);
      }
    });
  };

  return (
    <section className="p-6 bg-gray-100 min-h-screen flex justify-center">
      <div className="max-w-6xl w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* ภาพสินค้า – Image Carousel */}
          <div className="space-y-6">
            <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-md bg-gray-200">
              <Image
                src={post.images[currentImageIndex]}
                alt={`${post.name} - Image ${currentImageIndex + 1}`}
                fill
                className="object-cover transition-all duration-500"
              />
              {post.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    disabled={currentImageIndex === 0}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
                  >
                    &#8592;
                  </button>
                  <button
                    onClick={handleNextImage}
                    disabled={currentImageIndex === post.images.length - 1}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
                  >
                    &#8594;
                  </button>
                </>
              )}
            </div>
            {post.images.length > 1 && (
              <div className="mt-4 flex justify-center space-x-2">
                {post.images.map((img, index) => (
                  <div
                    key={index}
                    className={`w-16 h-16 relative rounded overflow-hidden border-2 cursor-pointer ${
                      index === currentImageIndex ? "border-blue-500" : "border-transparent"
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <Image
                      src={img}
                      alt={`${post.name} thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ข้อมูลสินค้า */}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">{post.name}</h1>

            <p className="text-gray-500 text-sm flex items-center gap-2">
              <FaClock className="text-gray-400" />
              {formattedTime}
            </p>

            <p className="text-gray-700">{post.description}</p>

            {/* เพิ่ม Category และ Condition */}
            <p className="text-gray-700">
              <strong>Category:</strong> {post.category?.name ?? "Unknown"}
            </p>
            <p className="text-gray-700">
              <strong>Condition:</strong> {post.condition}
            </p>

            {/* ข้อมูลโปรไฟล์เจ้าของโพสต์ */}
            <Link
              href={`/profile/${post.profile.id}`}
              className="flex items-center gap-3 p-4 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
            >
              <Image
                src={post.profile.profileImage ?? "/default-profile.png"}
                alt={post.profile.firstName}
                width={50}
                height={50}
                className="rounded-full border"
              />
              <div>
                <p className="text-lg font-semibold">
                  {post.profile.firstName} {post.profile.lastName}
                </p>
              </div>
            </Link>

            {/* ปุ่มต่างๆ */}
            <div className="flex gap-4">
              {isOwner ? (
                <Link
                  href={`/posts/${post.id}/edit`}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 flex items-center gap-2 cursor-pointer"
                >
                  <FaCog />
                  Edit Post
                </Link>
              ) : (
                <>
                  <button
                    onClick={handleToggleFavorite}
                    disabled={isPending}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 text-lg transition cursor-pointer ${
                      isFavorite ? "bg-red-500 text-white" : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    <FaHeart /> {isFavorite ? "Favorited" : "Favorite"}
                  </button>

                  {!offerSent && (
                    <button
                      onClick={handleOpenOfferModal}
                      disabled={isPending}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 flex items-center gap-2 cursor-pointer"
                    >
                      <FaExchangeAlt /> Make an Offer
                    </button>
                  )}
                </>
              )}
            </div>

            {/* แผนที่ (ถ้ามี) */}
            {post.lat && post.lng && (
              <div className="mt-6 p-4 bg-gray-100 rounded-xl border">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-red-500" /> Meeting Spot
                </h2>
                <div className="w-full h-40 rounded-lg overflow-hidden mt-2">
                  <MapLandmark location={{ lat: post.lat, lng: post.lng }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comments */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800">
            Comments ({comments.length})
          </h2>
          <div className="mt-4 flex gap-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg p-3"
              placeholder="Write a comment..."
            />
            <button
              onClick={handleCommentSubmit}
              disabled={isPending}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer"
            >
              Send
            </button>
          </div>

          {comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-gray-100 p-3 rounded-lg flex gap-3 mt-3"
            >
              <Image
                src={comment.profile.profileImage ?? "/default-profile.png"}
                width={40}
                height={40}
                className="rounded-full border"
                alt={comment.profile.firstName}
              />
              <div>
                <p className="font-semibold">
                  {comment.profile.firstName} {comment.profile.lastName}
                </p>
                <p className="text-gray-600">
                  {comment.content || "No content"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Make an Offer */}
      {isOfferModalOpen && (
        <div
          className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setIsOfferModalOpen(false)}
        >
          <div
            className="bg-white p-6 rounded shadow-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">Make an Offer</h2>

            <label className="block mb-2 font-semibold">
              Select your item to offer:
            </label>
            <select
              className="border p-2 w-full mb-4"
              value={selectedOfferedPostId}
              onChange={(e) => setSelectedOfferedPostId(e.target.value)}
            >
              <option value="">-- Please select --</option>
              {userItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>

            <div className="flex gap-4 justify-end">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded"
                onClick={() => setIsOfferModalOpen(false)}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitOffer}
                disabled={isPending}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Submit Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}