"use client";

import { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaHeart } from "react-icons/fa";
import { getFavorites, toggleFavorite } from "./actions";

interface FavoritePost {
  id: string;
  name: string;
  image: string | null;
  province: string;
  price: number;
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoritePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [, startTransition] = useTransition();

  // ✅ โหลดรายการ Favorites จาก API
  useEffect(() => {
    const fetchFavorites = async () => {
      const data = await getFavorites();
      setFavorites(data || []);
      setLoading(false);
    };
    fetchFavorites();
  }, []);

  // ✅ Toggle Favorite
  const handleToggleFavorite = (postId: string) => {
    startTransition(async () => {
      try {
        await toggleFavorite({ postId });
        setFavorites((prev) => prev.filter((post) => post.id !== postId));
      } catch (error) {
        console.error("Error removing favorite:", error);
      }
    });
  };

  return (
    <section className="p-6 bg-gray-100 min-h-screen flex justify-center">
      <div className="max-w-6xl w-full bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Favorites</h1>

        {loading ? (
          <p>Loading...</p>
        ) : favorites.length === 0 ? (
          <p className="text-gray-500">No favorite posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((post) => (
              <div key={post.id} className="bg-gray-100 p-4 rounded-lg shadow-md relative">
                <Link href={`/posts/${post.id}`} className="block">
                  <div className="relative w-full h-40 rounded-lg overflow-hidden">
                    <Image
                      src={post.image || "/default-image.jpg"}
                      alt={post.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h2 className="mt-2 text-lg font-semibold text-gray-800">{post.name}</h2>
                  <p className="text-gray-600">{post.province}</p>
                  <p className="text-red-500 font-bold">${post.price}</p>
                </Link>

                {/* ปุ่มยกเลิก Favorite */}
                <button
                  onClick={() => handleToggleFavorite(post.id)}
                  className="absolute top-3 right-3 text-red-500 hover:text-red-700 transition cursor-pointer"
                >
                  <FaHeart size={24} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
