"use client";

import { useState } from "react";

const FavoriteToggleButton = () => {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = async () => {
    setIsFavorite(!isFavorite);
    // เพิ่มโค้ดเรียก API สำหรับ toggle favorite
  };

  return (
    <button onClick={toggleFavorite} className="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`h-6 w-6 ${isFavorite ? "text-pink-500" : "text-gray-600"}`}
        fill={isFavorite ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 21l7-5 7 5V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16z"
        />
      </svg>
    </button>
  );
};

export default FavoriteToggleButton;
