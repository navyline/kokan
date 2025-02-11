"use client";

import { useState, useEffect, useTransition } from "react";
import { PlusCircle, LogIn, MessageCircle, Menu } from "lucide-react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import Search from "./Search";
import { getLocalIdByClerkId } from "@/app/actions/getLocalId";
import NotificationMenu from "./NotificationMenu";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  localId: string | null;
}

function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="w-10 h-10 relative">
        <Image src="/logo.png" alt="Kokan Logo" layout="fill" objectFit="cover" className="rounded-full" />
      </div>
      <span className="text-xl font-bold text-gray-800 hidden sm:block">Kokan</span>
    </Link>
  );
}

function CreatePostButton() {
  return (
    <Link href="/posts/create" className="p-2 sm:p-3 bg-yellow-400 rounded-full text-white hover:bg-yellow-500 transition flex items-center justify-center shadow-md">
      <PlusCircle className="h-5 w-5 sm:h-6 sm:w-6" />
    </Link>
  );
}

function ChatButton() {
  return (
    <Link href="/chats" className="p-2 sm:p-3 text-gray-600 hover:text-teal-500 transition flex items-center justify-center">
      <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
    </Link>
  );
}

function Sidebar({ isOpen, onClose, localId }: SidebarProps) {
  return (
    <div className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-md transform ${isOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 z-50 flex flex-col`}>      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="font-bold text-xl text-gray-800">เมนู</h2>
        <button onClick={onClose} className="text-gray-600 hover:text-gray-800 transition">✕</button>
      </div>

      <div className="p-4 overflow-y-auto flex-1 text-gray-700 space-y-4">
        <Link href={localId ? `/profile/${localId}` : "#"} className="block px-2 py-2 rounded hover:bg-gray-100 transition">
          โปรไฟล์ของฉัน
        </Link>
        <Link href="/dashboard" className="block px-2 py-2 rounded hover:bg-gray-100 transition">
          Dashboard
        </Link>
        <Link href="/favorites" className="block px-2 py-2 rounded hover:bg-gray-100 transition">
          My Favorites
        </Link>
        <Link href="/settings" className="block px-2 py-2 rounded hover:bg-gray-100 transition">
          Settings
        </Link>
        <SignOutButton redirectUrl="/">
          <span className="block px-2 py-2 rounded hover:bg-gray-100 transition cursor-pointer">Logout</span>
        </SignOutButton>
      </div>
    </div>
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
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} localId={localId} />
      <nav className="bg-white shadow-md px-4 py-2 flex items-center justify-between relative flex-wrap">
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-600 hover:text-teal-500 transition">
            <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
          </button>
          <Logo />
        </div>

        <div className="w-full sm:flex-1 sm:min-w-[200px] mx-4 flex justify-center mt-2 sm:mt-0">
          <Search />
        </div>

        <div className="flex items-center space-x-1 sm:space-x-2">
          <CreatePostButton />
          <ChatButton />
          <NotificationMenu />
          {user ? (
            <Link href={`/profile/${localId}`} className="flex items-center space-x-2">
              <Image src={user?.imageUrl || "/default-profile.png"} alt="Profile" width={32} height={32} className="h-8 w-8 rounded-full border border-gray-300 object-cover" />
              <span className="hidden md:block text-gray-700 font-medium">{user?.firstName || "User"}</span>
            </Link>
          ) : (
            <Link href="/sign-in" className="bg-gray-200 text-gray-800 px-3 py-1 sm:px-4 sm:py-2 rounded-full hover:bg-gray-300 transition">
              <LogIn className="h-4 w-4 sm:h-5 sm:w-5 mr-1" /> Sign In
            </Link>
          )}
        </div>
      </nav>
    </>
  );
}
