"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useState, useTransition } from "react";
import { FaMapMarkerAlt, FaClock, FaHeart, FaExchangeAlt } from "react-icons/fa";
import Link from "next/link";
import { formatDistance } from "date-fns/formatDistance";
import { enUS } from "date-fns/locale";
import { addComment, toggleFavorite, makeTradeOffer } from "./actions";

// ✅ Lazy Load แผนที่
const MapLandmark = dynamic(() => import("@/components/map/Map"), { ssr: false });

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  profile: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string | null;
  };
}

interface PostDetailClientProps {
  post: {
    id: string;
    name: string;
    description: string;
    image?: string;
    province: string;
    lat?: number;
    lng?: number;
    price: number;
    createdAt?: string;
    profile: {
      id: string;
      firstName: string;
      lastName: string;
      profileImage?: string | null;
    };
    comments: Comment[];
  };
  currentUserId?: string;
}

export default function PostDetailClient({ post, currentUserId }: PostDetailClientProps) {
  const formattedTime = post.createdAt && !isNaN(new Date(post.createdAt).getTime())
    ? formatDistance(new Date(post.createdAt), new Date(), { addSuffix: true, locale: enUS })
    : "Unknown time";

  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(post.comments || []);
  const [isFavorite, setIsFavorite] = useState(false);
  const [offerSent, setOfferSent] = useState(false);
  const [, startTransition] = useTransition();

  const isOwner = currentUserId === post.profile.id;

  // ✅ Toggle Favorite
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

  // ✅ Make an Offer
  const handleTradeOffer = () => {
    if (isOwner) return; // ✅ ป้องกันเจ้าของโพสต์กดปุ่ม Offer

    startTransition(async () => {
      try {
        await makeTradeOffer({ postId: post.id });
        setOfferSent(true);
      } catch (error) {
        console.error("Trade offer failed:", error);
      }
    });
  };

  // ✅ เพิ่มคอมเมนต์
  const handleCommentSubmit = () => {
    if (!newComment.trim()) return;

    startTransition(async () => {
      try {
        const createdComment = await addComment({ postId: post.id, content: newComment });

        setComments((prev) => [
          {
            ...createdComment,
            createdAt: new Date(createdComment.createdAt).toISOString(),
            profile: {
              ...createdComment.profile,
              profileImage: createdComment.profile.profileImage ?? "/default-profile.png",
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
          <div className="space-y-6">
            <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-md bg-gray-200">
              <Image src={post.image || "/default-image.jpg"} alt={post.name} fill className="object-cover" />
            </div>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-gray-800">{post.name}</h1>

            <p className="text-gray-500 text-sm flex items-center gap-2">
              <FaClock className="text-gray-400" /> {formattedTime}
            </p>

            <p className="text-gray-700">{post.description}</p>

            <div className="flex items-center gap-3 p-4 bg-gray-100 rounded-xl">
              <Image
                src={post.profile.profileImage ?? "/default-profile.png"}
                alt={post.profile.firstName}
                width={50}
                height={50}
                className="rounded-full border"
              />
              <div>
                <p className="text-lg font-semibold">{post.profile.firstName} {post.profile.lastName}</p>
                <Link href={`/profile/${post.profile.id}`} className="text-blue-500 text-sm hover:underline cursor-pointer">
                  View Profile
                </Link>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleToggleFavorite}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 text-lg transition cursor-pointer ${
                  isFavorite ? "bg-red-500 text-white" : "bg-gray-300 text-gray-700"
                }`}
              >
                <FaHeart /> {isFavorite ? "Favorited" : "Favorite"}
              </button>

              {!isOwner && !offerSent && (
                <button
                  onClick={handleTradeOffer}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 flex items-center gap-2 cursor-pointer"
                >
                  <FaExchangeAlt /> Make an Offer
                </button>
              )}
            </div>

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

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-800">Comments ({comments.length})</h2>
          <div className="mt-4 flex gap-3">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg p-3"
              placeholder="Write a comment..."
            />
            <button onClick={handleCommentSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer">
              Send
            </button>
          </div>
          {comments.map((comment) => (
            <div key={comment.id} className="bg-gray-100 p-3 rounded-lg flex gap-3 mt-3">
              <Image src={comment.profile.profileImage ?? "/default-profile.png"} width={40} height={40} className="rounded-full border" alt={comment.profile.firstName} />
              <div>
                <p className="font-semibold">{comment.profile.firstName} {comment.profile.lastName}</p>
                <p className="text-gray-600">{comment.content || "No content"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
