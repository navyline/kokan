"use client";

import { useState, useEffect } from "react";

export default function EditProfilePage() {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    profileImage: "",
  });

  // โหลดข้อมูลโปรไฟล์ปัจจุบัน
  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => setProfile(data.profile))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      alert("Profile updated!");
    } catch (error) {
      console.error(error);
      alert("Failed to update profile");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>First Name</label>
          <input
            type="text"
            value={profile.firstName}
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label>Last Name</label>
          <input
            type="text"
            value={profile.lastName}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label>Username</label>
          <input
            type="text"
            value={profile.userName}
            onChange={(e) => setProfile({ ...profile, userName: e.target.value })}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            className="border p-2 w-full"
          />
        </div>
        <div>
          <label>Profile Image URL</label>
          <input
            type="text"
            value={profile.profileImage}
            onChange={(e) =>
              setProfile({ ...profile, profileImage: e.target.value })
            }
            className="border p-2 w-full"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Save Changes
        </button>
      </form>
    </div>
  );
}
