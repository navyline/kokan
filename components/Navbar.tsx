"use client";

import Link from "next/link";
import ProfileDropdown from "./ProfileDropdown";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
            Kokan
          </Link>
        </div>

        {/* เมนู */}
        <div className="hidden md:flex items-center space-x-6">
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
          {/* Dropdown โปรไฟล์ */}
          <ProfileDropdown />
        </div>
      </div>
    </nav>
  );
}
