"use client";

import { useState } from "react";
import { Bell, PlusCircle, LogIn } from "lucide-react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import Search from "./Search";
import Link from "next/link";
import Image from "next/image";

function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
        KO
      </div>
      <span className="text-xl font-bold text-gray-800">Kokan</span>
    </Link>
  );
}

function CreatePostButton() {
  return (
    <Link
      href="/posts/create"
      className="p-3 bg-yellow-400 rounded-full text-white hover:bg-yellow-500 transition flex items-center justify-center shadow-md"
    >
      <PlusCircle className="h-6 w-6" />
    </Link>
  );
}

function Notification() {
  const [notifications] = useState(5); // Mock notifications count

  return (
    <div className="relative">
      <button className="p-3 text-gray-600 hover:text-teal-500 transition">
        <Bell className="h-6 w-6" />
      </button>
      {notifications > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {notifications}
        </span>
      )}
    </div>
  );
}

function UserMenu() {
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) {
    return (
      <Link
        href="/sign-in"
        className="flex items-center bg-gray-200 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-300 transition"
      >
        <LogIn className="h-5 w-5" />
        <span>Sign In</span>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center space-x-2"
      >
        <Image
          src={user.imageUrl || "/default-profile.png"}
          alt="Profile"
          width={32}
          height={32}
          className="h-8 w-8 rounded-full border border-gray-300"
        />
        <span className="hidden sm:block text-gray-700">{user.firstName}</span>
      </button>
      {menuOpen && (
        <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md py-2 w-40">
          <Link
            href="/dashboard"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Dashboard
          </Link>
          <Link
            href="/favorites"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            My Favorites
          </Link>
          <Link
            href="/settings"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Settings
          </Link>
          <SignOutButton redirectUrl="/">
            <span className="block px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer">
              Logout
            </span>
          </SignOutButton>
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <Logo />

      {/* Search */}
      <div className="flex-grow mx-4">
        <Search />
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-4">
        <CreatePostButton />
        <Notification />
        <UserMenu />
      </div>
    </nav>
  );
}
