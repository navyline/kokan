"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/home?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-2xl">
      {/* ช่อง Input */}
      <input
        type="text"
        placeholder="ค้นหา"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-white text-gray-700 border border-gray-300 rounded-full pl-4 pr-12 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
      />

      {/* ปุ่มแว่นขยายด้านขวา */}
      <button
        type="submit"
        className="absolute right-0 top-0 h-full px-4 bg-gray-200 rounded-r-full text-gray-500 hover:text-gray-700 transition"
      >
        <SearchIcon className="h-5 w-5" />
      </button>
    </form>
  );
}
