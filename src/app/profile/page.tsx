"use client"; 
// เพราะฟอร์มต้องจัดการ state / onSubmit ในฝั่ง Client

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  // State สำหรับเก็บค่าฟอร์ม
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [profileImage, setProfileImage] = useState("");

  // ดึงข้อมูลโปรไฟล์จาก API ของเรา (ถ้ามี)
  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        // เช็คว่ามีโปรไฟล์ไหม ถ้ามีก็เติมข้อมูลใส่ state
        if (data?.profile) {
          setFirstName(data.profile.firstName || "");
          setLastName(data.profile.lastName || "");
          setUserName(data.profile.userName || "");
          setProfileImage(data.profile.profileImage || "");
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName,
          lastName,
          userName,
          profileImage,
        }),
      });
      if (!res.ok) {
        throw new Error("Failed to save profile");
      }
      // ถ้าสำเร็จอาจจะ redirect หรือ refresh หน้า
      router.refresh();
      alert("Profile saved!");
    } catch (error) {
      console.error(error);
      alert("Error saving profile");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">First Name</label>
          <input
            className="border p-2 w-full"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block mb-1">Last Name</label>
          <input
            className="border p-2 w-full"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Username</label>
          <input
            className="border p-2 w-full"
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div>
          <label className="block mb-1">Profile Image URL</label>
          <input
            className="border p-2 w-full"
            type="text"
            value={profileImage}
            onChange={(e) => setProfileImage(e.target.value)}
          />
        </div>
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
}
