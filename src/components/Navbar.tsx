"use client";

import { useState, useEffect, useTransition } from "react";
import { PlusCircle, LogIn, MessageCircle, Menu, Search as SearchIcon } from "lucide-react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { getLocalIdByClerkId } from "@/app/actions/getLocalId";
import NotificationMenu from "./NotificationMenu";

// == (1) เพิ่ม import สำหรับ Search ถ้าคุณแยก Search ออกเป็นคอมโพเนนต์อื่น ==
// import Search from "./Search";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  localId: string | null;
}

function Logo() {
  return (
    <Link href="/home" className="flex items-center space-x-2">
      <div className="relative w-10 h-10">
        <Image
          src="/logo.png"
          alt="Kokan Logo"
          fill
          className="object-cover rounded-full"
        />
      </div>
      <span className="hidden sm:block text-xl font-bold text-gray-800">
        Kokan
      </span>
    </Link>
  );
}

// == (3) เพิ่มข้อความ "สร้างโพส" พร้อมไอคอน + ==
function CreatePostButton() {
  return (
    <Link
      href="/posts/create"
      className="inline-flex items-center space-x-1 p-2 sm:p-3
                 bg-teal-500 text-white rounded-full hover:bg-teal-600
                 transition shadow-md"
    >
      <PlusCircle className="h-5 w-5 sm:h-6 sm:w-6" />
      <span className="hidden sm:inline-block font-medium">สร้างโพส</span>
    </Link>
  );
}

function ChatButton() {
  return (
    <Link
      href="/chats"
      className="p-2 sm:p-3 text-gray-600 hover:text-teal-500 transition flex items-center justify-center"
    >
      <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
    </Link>
  );
}

// == (2) แก้เอา "โปรไฟล์ของฉัน" ออก ==
function Sidebar({ isOpen, onClose, }: SidebarProps) {
  return (
    <div
      className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-md transform ${isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-50 flex flex-col`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="font-bold text-xl text-gray-800">เมนู</h2>
        <button
          onClick={onClose}
          className="text-gray-600 hover:text-gray-800 transition"
        >
          ✕
        </button>
      </div>

      <div className="p-4 overflow-y-auto flex-1 text-gray-700 space-y-4">
        {/* เดิม: โปรไฟล์ของฉัน (ลบออก) */}
        {/* <Link
          href={localId ? `/profile/${localId}` : "#"}
          className="block px-2 py-2 rounded hover:bg-gray-100 transition"
        >
          โปรไฟล์ของฉัน
        </Link> */}
        <Link
          href="/dashboard"
          className="block px-2 py-2 rounded hover:bg-gray-100 transition"
        >
          Dashboard
        </Link>
        <Link
          href="/favorites"
          className="block px-2 py-2 rounded hover:bg-gray-100 transition"
        >
          My Favorites
        </Link>
        <Link
          href="/settings"
          className="block px-2 py-2 rounded hover:bg-gray-100 transition"
        >
          Settings
        </Link>
        <SignOutButton redirectUrl="/">
          <span className="block px-2 py-2 rounded hover:bg-gray-100 transition cursor-pointer">
            Logout
          </span>
        </SignOutButton>
      </div>
    </div>
  );
}

// == (2) เพิ่ม Search ให้มีไอคอนแว่นขยายด้านซ้าย ==
function Search() {
  const [query, setQuery] = useState("");
  // ถ้าใช้ useRouter push ไปหน้า /home
  // import { useRouter } from "next/navigation";
  // const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    // router.push(`/home?search=${encodeURIComponent(query.trim())}`);
    // หรือจะ console.log ดูก่อน
    console.log("Searching for:", query);
  };

  return (
    <form onSubmit={handleSearch} className="relative flex items-center">
      {/* ไอคอนแว่นขยายด้านซ้าย */}
      <SearchIcon className="absolute left-3 h-5 w-5 text-gray-400" />

      <input
        type="text"
        placeholder="Search posts..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="border border-gray-300 rounded-full py-2 pl-10 pr-4 w-64 md:w-96
                   focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
      {/* ปุ่มกดค้นหาด้านขวาก็ได้ แต่ถ้าไม่จำเป็นอาจไม่ต้องใส่ */}
      <button
        type="submit"
        className="hidden"
        aria-label="Search"
      ></button>
    </form>
  );
}

export default function Navbar() {
  const { user } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [localId, setLocalId] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  useEffect(() => {
    if (!user) {
      setLocalId(null);
      return;
    }

    const formData = new FormData();
    formData.set("clerkId", user.id);

    startTransition(async () => {
      const result = await getLocalIdByClerkId(formData);
      setLocalId(result);
    });
  }, [user]);

  return (
    <>
      {/* Sidebar */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        localId={localId}
      />

      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="mx-auto px-4 py-2 flex items-center justify-between relative flex-wrap">
          {/* ซ้าย: ปุ่มเปิด Sidebar + Logo */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-600 hover:text-teal-500 transition"
            >
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <Logo />
          </div>

          {/* กลาง: Search (hidden บนมือถือ, โชว์บน sm ขึ้นไป) */}
          <div className="hidden sm:block flex-1 mx-4">
            <Search />
          </div>

          {/* ขวา: ปุ่มต่าง ๆ และโปรไฟล์/Sign in */}
          <div className="flex items-center space-x-2">
            <CreatePostButton />
            <ChatButton />
            <NotificationMenu />

            {user ? (
              <Link
                href={`/profile/${localId}`}
                className="flex items-center space-x-2"
              >
                <Image
                  src={user?.imageUrl || "/default-profile.png"}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="h-8 w-8 rounded-full border border-gray-300 object-cover"
                />
                <span className="hidden md:block text-gray-700 font-medium">
                  {user?.firstName || "User"}
                </span>
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="inline-flex items-center bg-teal-500 text-white px-3 py-1
                           sm:px-4 sm:py-2 rounded-full hover:bg-teal-600 transition"
              >
                <LogIn className="h-4 w-4 sm:h-5 sm:w-5 mr-1" />
                <span className="text-sm sm:text-base">Sign In</span>
              </Link>
            )}
          </div>
        </div>

        {/* แสดง Search ด้านล่างบนมือถือ (block sm:hidden) */}
        <div className="block sm:hidden w-full px-4 pb-2">
          <Search />
        </div>
      </nav>
    </>
  );
}
