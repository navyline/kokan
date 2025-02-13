"use client";

import { useState, useEffect, useTransition } from "react";
import { PlusCircle, LogIn, MessageCircle, Menu } from "lucide-react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { getLocalIdByClerkId } from "@/app/actions/getLocalId";
import NotificationMenu from "./NotificationMenu";
import Search from "./Search";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  localId: string | null;
}

function Logo() {
  return (
    <Link href="/home" className="flex items-center space-x-2">
      <div className="relative w-10 h-10">
        <Image src="/logo.png" alt="Kokan Logo" fill className="object-cover rounded-full" />
      </div>
      <span className="hidden sm:block text-xl font-bold text-gray-800">Kokan</span>
    </Link>
  );
}

function CreatePostButton() {
  return (
    <Link href="/posts/create" className="inline-flex items-center space-x-1 px-4 py-2 sm:px-5 sm:py-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 transition shadow-md text-sm sm:text-base">
      <PlusCircle className="h-5 w-5 sm:h-6 sm:w-6" />
      <span className="font-medium">สร้างโพส</span>
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
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} localId={localId} />

      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="relative flex items-center w-full px-4 py-2">
          
          {/* ซ้าย: ปุ่มเปิด Sidebar + Logo */}
          <div className="flex items-center space-x-4 w-auto">
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-600 hover:text-teal-500 transition">
              <Menu className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
            <Logo />
          </div>

          {/* กลาง: Search ใช้ absolute + transform เพื่อให้อยู่ตรงกลาง */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-lg">
            <Search />
          </div>

          {/* ขวา: ปุ่มต่าง ๆ และโปรไฟล์/Sign in */}
          <div className="flex items-center space-x-4 w-auto ml-auto">
            <CreatePostButton />
            <ChatButton />
            <NotificationMenu />

            {user ? (
              <Link href={`/profile/${localId}`} className="flex items-center space-x-2">
                <Image src={user?.imageUrl || "/default-profile.png"} alt="Profile" width={32} height={32} className="h-8 w-8 rounded-full border border-gray-300 object-cover" />
                <span className="hidden md:block text-gray-700 font-medium">{user?.firstName || "User"}</span>
              </Link>
            ) : (
              <Link href="/sign-in" className="inline-flex items-center bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600 transition">
                <LogIn className="h-5 w-5 sm:h-6 sm:w-6 mr-1" />
                <span className="text-sm sm:text-base">Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* แสดง Search ด้านล่างบนมือถือ (block sm:hidden) */}
      <div className="block sm:hidden w-full px-4 pb-2">
        <Search />
      </div>
    </>
  );
}

/* Sidebar */
function Sidebar({ isOpen, onClose, localId }: SidebarProps) {
  return (
    <>
      {/* Backdrop ดำจางๆ เมื่อ Sidebar เปิด */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-72 bg-white shadow-md transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-50 flex flex-col`}
      >
        {/* หัวข้อ Sidebar */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200">
          <h2 className="font-bold text-xl text-gray-800">เมนู</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-gray-800 text-xl transition">
            ✕
          </button>
        </div>

        {/* รายการเมนู */}
        <div className="p-4 overflow-y-auto flex-1 text-gray-700 space-y-4">
          {/* โปรไฟล์ของฉัน */}
          {localId && (
            <Link
              href={`/profile/${localId}`}
              className="px-4 py-2 rounded-lg hover:bg-gray-100 transition flex items-center space-x-2"
            >
              <Image
                src="/default-profile.png"
                alt="Profile"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full border border-gray-300 object-cover"
              />
              <span className="font-medium">โปรไฟล์ของฉัน</span>
            </Link>
          )}

          {/* เมนูทั่วไป */}
          <Link href="/dashboard" className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition">Dashboard</Link>
          <Link href="/favorites" className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition">My Favorites</Link>
          <Link href="/settings" className="block px-4 py-2 rounded-lg hover:bg-gray-100 transition">Settings</Link>

          {/* Logout */}
          <SignOutButton redirectUrl="/">
            <span className="block px-4 py-2 rounded-lg hover:bg-red-100 text-red-600 transition cursor-pointer">
              Logout
            </span>
          </SignOutButton>
        </div>
      </div>
    </>
  );
}
