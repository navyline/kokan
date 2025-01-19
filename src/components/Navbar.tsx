"use client";

import { useState } from "react";
import { Bell, PlusCircle, Info, LogIn } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Search from "./Search";
import Link from "next/link";
import Image from 'next/image';

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

<Search />;

function CreatePostButton() {
  return (
    <Link
      href="/posts/create"
      className="flex items-center space-x-2 bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600 transition"
    >
      <PlusCircle className="h-5 w-5" />
      <span>Create Post</span>
    </Link>
  );
}

function Notification() {
  const [notifications] = useState(5); // Mock notifications count

  return (
    <button className="relative">
      <Bell className="h-6 w-6 text-gray-600 hover:text-teal-500" />
      {notifications > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
          {notifications}
        </span>
      )}
    </button>
  );
}

function UserMenu() {
  const { user } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!user) {
    return (
      <Link
        href="/sign-in"
        className="flex items-center space-x-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-300 transition"
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
          src={user.imageUrl}
          alt="Profile"
          className="h-8 w-8 rounded-full border border-gray-300"
        />
        <span className="hidden sm:block text-gray-700">{user.firstName}</span>
      </button>
      {menuOpen && (
        <div className="absolute right-0 mt-2 bg-white shadow-lg rounded-md py-2 w-40">
          <a
            href="/dashboard"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Dashboard
          </a>
          <a
            href="/favorites"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            My Favorites
          </a>
          <a
            href="/settings"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Settings
          </a>
          <a
            href="/logout"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            Logout
          </a>
        </div>
      )}
    </div>
  );
}

function AboutLink() {
  return (
    <a
      href="/about"
      className="flex items-center space-x-2 text-gray-600 hover:text-teal-500 transition"
    >
      <Info className="h-5 w-5" />
      <span>About</span>
    </a>
  );
}

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-3 flex items-center justify-between">
      {/* Left Section: Logo */}
      <Logo />

      {/* Center Section: Search Bar */}
      <Search />

      {/* Right Section: Buttons */}
      <div className="flex space-x-4 items-center">
        <CreatePostButton />
        <Notification />
        <UserMenu />
        <AboutLink />
      </div>
    </nav>
  );
}
