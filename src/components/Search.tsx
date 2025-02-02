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
    router.push(`/?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={handleSearch} className="relative flex items-center">
      <input
        type="text"
        placeholder="Search posts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border border-gray-300 rounded-full py-2 px-4 w-64 md:w-96 focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
      <button type="submit" className="absolute right-3 text-gray-500 hover:text-teal-600">
        <SearchIcon className="h-5 w-5" />
      </button>
    </form>
  );
}
