"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Suspense } from 'react'

const Search = () => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const [search, setSearch] = useState(
    searchParams.get("search")?.toString() || ""
  );

  const handleSearch = useDebouncedCallback((value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    replace(`/?${params.toString()}`);
  }, 500);

  useEffect(() => {
    const searchParam = searchParams.get("search");
    // code body
    if (!searchParam) {
      setSearch("");
    }
  }, [searchParams]);

  return (
    <Suspense>
    <Input
      type="text"
      placeholder="Seach ..."
      className="max-w-xs"
      onChange={(e) => {
        setSearch(e.target.value);
        handleSearch(e.target.value);
      }}
      value={search}
    />
    </Suspense>
  );
};
export default Search;
