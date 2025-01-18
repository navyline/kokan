"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useUser, SignInButton, SignOutButton, SignUpButton } from "@clerk/nextjs";
import { Bell, Menu, Sun, Moon, LogIn, User, LogOut, Plus } from "lucide-react";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const { isSignedIn, user } = useUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-3xl font-bold font-mono tracking-wider">
              Kokan
            </Link>
          </div>

          {/* Main Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-6">
            <Link
              href="/"
              className="hover:text-yellow-300 transition duration-300"
            >
              Home
            </Link>
            <Link
              href="/posts"
              className="hover:text-yellow-300 transition duration-300"
            >
              Browse Posts
            </Link>
            {isSignedIn && (
              <Link
                href="/posts/new"
                className="hover:text-yellow-300 transition duration-300 flex items-center"
              >
                <Plus size={16} />
                <span className="ml-1">Create Post</span>
              </Link>
            )}
            <Link
              href="/about"
              className="hover:text-yellow-300 transition duration-300"
            >
              About Us
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="p-2 rounded-full bg-yellow-300 hover:bg-yellow-400 text-black transition duration-300"
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {/* Notifications */}
            <button className="relative p-2 rounded-full bg-yellow-300 hover:bg-yellow-400 text-black transition duration-300">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full">
                3
              </span>
            </button>

            {/* Authentication */}
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                {/* Profile */}
                <div className="flex items-center space-x-2">
                  <img
                    src={user?.imageUrl || "/default-avatar.png"}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full border-2 border-yellow-300"
                  />
                  <Link
                    href="/profile"
                    className="text-yellow-100 hover:text-yellow-300 transition duration-300"
                  >
                    {user?.firstName || "Profile"}
                  </Link>
                </div>

                {/* Sign Out */}
                <SignOutButton>
                  <button className="flex items-center space-x-2 p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300">
                    <LogOut size={18} />
                    <span>Sign Out</span>
                  </button>
                </SignOutButton>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                {/* Sign In */}
                <SignInButton>
                  <button className="flex items-center space-x-2 p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300">
                    <LogIn size={18} />
                    <span>Sign In</span>
                  </button>
                </SignInButton>

                {/* Sign Up */}
                <SignUpButton>
                  <button className="flex items-center space-x-2 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300">
                    <User size={18} />
                    <span>Sign Up</span>
                  </button>
                </SignUpButton>
              </div>
            )}

            {/* Mobile Menu */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="sm:hidden p-2 rounded-full bg-yellow-300 hover:bg-yellow-400 text-black transition duration-300"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="sm:hidden bg-white text-black">
          <div className="px-4 py-2 space-y-1">
            <Link href="/" className="block hover:text-blue-500">
              Home
            </Link>
            <Link href="/posts" className="block hover:text-blue-500">
              Browse Posts
            </Link>
            {isSignedIn && (
              <Link href="/posts/new" className="block hover:text-blue-500">
                Create Post
              </Link>
            )}
            <Link href="/about" className="block hover:text-blue-500">
              About Us
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
