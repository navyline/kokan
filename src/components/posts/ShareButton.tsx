"use client";

import { useState } from "react";
import { FaShareAlt, FaCheck } from "react-icons/fa";

interface ShareButtonProps {
  postId: string;
  name: string;
}

export default function ShareButton({ postId }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/posts/${postId}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopyLink}
      className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition"
    >
      {copied ? <FaCheck className="text-green-500" /> : <FaShareAlt />}
      <span className="hidden md:inline">{copied ? "Copied!" : "Share"}</span>
    </button>
  );
}
