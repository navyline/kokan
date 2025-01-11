"use client";

import { useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false); // State สำหรับเปิด/ปิดเมนู
  const { user } = useUser(); // ดึงข้อมูลผู้ใช้จาก Clerk
  const { signOut } = useAuth(); // ฟังก์ชัน Logout

  const handleToggle = () => setIsOpen(!isOpen);
  const handleLogout = () => {
    signOut();
    setIsOpen(false);
  };

  if (!user) return null; // ถ้าไม่ได้ล็อกอิน ไม่แสดงปุ่ม

  return (
    <div className="relative">
      {/* ปุ่มโปรไฟล์ */}
      <button
        onClick={handleToggle}
        className="flex items-center space-x-2 focus:outline-none"
      >
        {/* รูปโปรไฟล์ */}
        <Image
          src={user.imageUrl} // รูปโปรไฟล์จาก Clerk (อาจต้องตรวจสอบชื่อฟิลด์)
          alt="Profile"
          width={32}
          height={32}
          className="rounded-full"
        />
        <span className="hidden md:block text-gray-700 font-medium">
          {user.firstName}
        </span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md z-50">
          <Link
            href="/profile"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            View Profile
          </Link>
          <Link
            href="/profile/edit"
            className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            Edit Profile
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
