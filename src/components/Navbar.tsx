"use client";

import { useState, useEffect, useTransition } from "react";
import { Bell, PlusCircle, LogIn } from "lucide-react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import Search from "./Search";
import Link from "next/link";
import Image from "next/image";
import { getLocalIdByClerkId } from "@/app/actions/getLocalId";

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
  const [notifications, setNotifications] = useState<number | null>(null);

  useEffect(() => {
    // Mock async fetch for notifications
    const fetchNotifications = async () => {
      setTimeout(() => {
        setNotifications(5); // Example: Replace with actual API call
      }, 1000);
    };

    fetchNotifications();
  }, []);

  return (
    <div className="relative">
      <button className="p-3 text-gray-600 hover:text-teal-500 transition">
        <Bell className="h-6 w-6" />
      </button>
      {notifications !== null && notifications > 0 && (
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
  const [localId, setLocalId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (!user) {
      setLocalId(null);
      return;
    }

    const formData = new FormData();
    formData.set("clerkId", user.id);

    startTransition(async () => {
      try {
        const result = await getLocalIdByClerkId(formData);
        setLocalId(result);
      } catch (error) {
        console.error("Failed to fetch localId:", error);
      }
    });
  }, [user]);

  if (!user) {
    return (
      <Link
        href="/sign-in"
        className="flex items-center bg-gray-200 text-gray-800 px-4 py-2 rounded-full hover:bg-gray-300 transition"
      >
        <LogIn className="h-5 w-5 mr-1" />
        <span>Sign In</span>
      </Link>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen((prev) => !prev)}
        className="flex items-center space-x-2"
      >
        <Image
          src={user.imageUrl || "/default-profile.png"}
          alt="Profile"
          width={32}
          height={32}
          className="h-8 w-8 rounded-full border border-gray-300 object-cover"
        />
        <span className="hidden sm:block text-gray-700">
          {user.firstName || "User"}
        </span>
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md py-2 border border-gray-100 z-50">
          {isPending && <p className="px-4 py-2 text-gray-500">Loading...</p>}
          {localId ? (
            <Link
              href={`/profile/${localId}`}
              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              My Profile
            </Link>
          ) : (
            !isPending && (
              <p className="px-4 py-2 text-gray-500">No Profile Found</p>
            )
          )}

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
      <Logo />

      <div className="flex-grow mx-4">
        <Search />
      </div>

      <div className="flex items-center space-x-4">
        <CreatePostButton />
        <Notification />
        <UserMenu />
      </div>
    </nav>
  );
}
