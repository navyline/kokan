"use client";

import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, XCircle } from "lucide-react"; // ตัวอย่างการนำไอคอนมาใช้
import VerificationFormModal from "./VerificationFormModal";
import { updateProfileAction } from "./actions";

interface Profile {
  id: string;
  clerkId: string;
  firstName?: string;
  lastName?: string;
  userName?: string;
  bio?: string | null; // ⬅ หาก DB เก็บ null ได้ ให้รองรับ | null
}

interface EditProfileClientProps {
  profile: Profile;
}

export default function EditProfileClient({ profile }: EditProfileClientProps) {
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);

  // Server Action หรือ API Route สำหรับอัปเดตโปรไฟล์
  async function handleUpdateProfile(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      await updateProfileAction(profile.id, {
        firstName: formData.get("firstName")?.toString() || "",
        lastName: formData.get("lastName")?.toString() || "",
        userName: formData.get("userName")?.toString() || "",
        bio: formData.get("bio")?.toString() || "",
      });
      router.push(`/profile/${profile.id}`);
    } catch (error) {
      console.error(error);
      // คุณอาจใช้ toast แสดงข้อความ error ได้
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          แก้ไขโปรไฟล์
        </h1>

        {/* ฟอร์มแก้ไขโปรไฟล์ */}
        <form onSubmit={handleUpdateProfile} className="space-y-6">
          {/* ชื่อจริง */}
          <div>
            <label
              htmlFor="firstName"
              className="block font-medium text-gray-700 mb-1"
            >
              ชื่อจริง
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              defaultValue={profile.firstName || ""}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 
                         focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
          </div>

          {/* นามสกุล */}
          <div>
            <label
              htmlFor="lastName"
              className="block font-medium text-gray-700 mb-1"
            >
              นามสกุล
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              defaultValue={profile.lastName || ""}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 
                         focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
          </div>

          {/* ชื่อผู้ใช้ */}
          <div>
            <label
              htmlFor="userName"
              className="block font-medium text-gray-700 mb-1"
            >
              ชื่อผู้ใช้ (@username)
            </label>
            <input
              id="userName"
              name="userName"
              type="text"
              defaultValue={profile.userName || ""}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 
                         focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
          </div>

          {/* Bio */}
          <div>
            <label
              htmlFor="bio"
              className="block font-medium text-gray-700 mb-1"
            >
              แนะนำตัว (Bio)
            </label>
            <textarea
              id="bio"
              name="bio"
              defaultValue={profile.bio || ""}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 
                         focus:outline-none focus:ring-2 focus:ring-teal-500 transition"
            />
          </div>

          {/* ปุ่ม Action */}
          <div className="flex justify-between items-center">
            {/* ปุ่มยกเลิก */}
            <a
              href={`/profile/${profile.id}`}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 transition"
            >
              <XCircle className="h-5 w-5" />
              <span>ยกเลิก</span>
            </a>

            {/* ปุ่มบันทึก */}
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-600 
                         text-white font-semibold py-2 px-6 rounded-lg transition"
            >
              <Save className="h-5 w-5" />
              <span>บันทึกการเปลี่ยนแปลง</span>
            </button>
          </div>
        </form>

        {/* ปุ่มยืนยันตัวตน */}
        <hr className="my-6" />
        <div className="text-right">
          <button
            onClick={() => setOpenModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
          >
            ยืนยันตัวตน
          </button>
        </div>

        {/* Modal ยืนยันตัวตน */}
        {openModal && (
          <VerificationFormModal
            profileId={profile.id}
            onClose={() => setOpenModal(false)}
          />
        )}
      </div>
    </main>
  );
}
