"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const Search = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.replace(`/?${params.toString()}`);
  }, 500);

  useEffect(() => {
    const searchParam = searchParams.get("search");
    setSearch(searchParam || "");
  }, [searchParams]);

  return (
    <Input
      type="text"
      placeholder="Search..."
      className="max-w-xs focus:ring-2 focus:ring-blue-500"
      onChange={(e) => {
        setSearch(e.target.value);
        handleSearch(e.target.value);
      }}
      value={search}
    />
  );
};

export default Search;
