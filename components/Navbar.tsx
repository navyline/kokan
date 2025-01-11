"use client";

import Link from "next/link";
import { useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs"; // ใช้ Clerk สำหรับการจัดการโปรไฟล์และ Logout

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser(); // ใช้สำหรับดึงข้อมูลผู้ใช้
  const { signOut } = useAuth(); // ใช้สำหรับ Logout

  const handleLogout = () => {
    signOut();
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo / Brand */}
        <div className="flex-shrink-0">
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
            Kokan
          </Link>
        </div>

        {/* เมนูปกติบนจอใหญ่ */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link
            href="/posts"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Posts
          </Link>
          <Link
            href="/exchange"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Exchange
          </Link>
          <Link
            href="/contact"
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            Contact
          </Link>

          {/* ถ้าผู้ใช้ล็อกอินอยู่ */}
          {user ? (
            <>
              {/* แสดงโปรไฟล์ */}
              <div className="flex items-center space-x-4">
                <img
                  src={user.imageUrl}
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-gray-600">{user.firstName}</span>
              </div>
              {/* ปุ่ม Logout */}
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-red-500 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/sign-in"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* ปุ่ม Hamburger บนมือถือ */}
        <div className="md:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 
                       text-gray-800 hover:text-gray-500 
                       focus:outline-none focus:ring-2 focus:ring-gray-200"
            onClick={() => setIsOpen(!isOpen)}
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
          >
            <svg
              className="h-6 w-6"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                // Icon close
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                // Icon hamburger
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* เมนูแสดงเมื่อกด hamburger บนจอเล็ก */}
      {isOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/posts"
              className="block px-3 py-2 rounded-md text-base font-medium 
                         text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Posts
            </Link>
            <Link
              href="/exchange"
              className="block px-3 py-2 rounded-md text-base font-medium 
                         text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Exchange
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 rounded-md text-base font-medium 
                         text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              onClick={() => setIsOpen(false)}
            >
              Contact
            </Link>
            {user ? (
              <>
                <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-600">
                  Welcome, {user.firstName}
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-gray-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/sign-in"
                className="block px-3 py-2 rounded-md text-base font-medium 
                           text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
