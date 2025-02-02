"use client";

import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface FavoriteToggleButtonProps {
  postId: string;
}

export default function FavoriteToggleButton({ postId }: FavoriteToggleButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false);

  const handleToggleFavorite = async () => {
    setIsFavorited(!isFavorited);

    try {
      await fetch("/api/favorites", {
        method: "POST",
        body: JSON.stringify({ postId, favorite: !isFavorited }),
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error updating favorite:", error);
      setIsFavorited(!isFavorited); // Undo on error
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition"
    >
      {isFavorited ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
      <span className="hidden md:inline">{isFavorited ? "Unfavorite" : "Favorite"}</span>
    </button>
  );
}
