"use client";

import React from "react";
import toast from "react-hot-toast";
import { updateUserRole, deleteUser } from "@/app/actions/adminActions";

interface User {
  id: string;
  email: string | null;
  userName: string;
  role: string;
  // ถ้ามีรูปโปรไฟล์ก็เพิ่ม: profileImage?: string
}

interface UserManagementProps {
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export default function UserManagement({ users, setUsers }: UserManagementProps) {
  const handleChangeRole = async (userId: string, role: "ADMIN" | "USER") => {
    try {
      await updateUserRole(userId, role);
      toast.success("อัปเดตบทบาทสำเร็จ");
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role } : u))
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "เกิดข้อผิดพลาดในการอัปเดตบทบาท");
      } else {
        toast.error("เกิดข้อผิดพลาดในการอัปเดตบทบาท");
      }
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("คุณแน่ใจหรือว่าต้องการลบผู้ใช้งานนี้?")) return;
    try {
      await deleteUser(userId);
      toast.success("ลบผู้ใช้สำเร็จ");
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message || "เกิดข้อผิดพลาดในการลบผู้ใช้");
      } else {
        toast.error("เกิดข้อผิดพลาดในการลบผู้ใช้");
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      <h2 className="text-xl font-bold text-gray-700">
        ผู้ใช้งาน ({users.length})
      </h2>
      <div className="border-t pt-3 space-y-3 max-h-80 overflow-auto">
        {users.map((user) => (
          <div
            key={user.id}
            className="border border-gray-200 rounded p-3 hover:shadow-sm transition"
          >
            {/* ถ้ามีรูป user.profileImage => <img src={user.profileImage} ... /> */}
            <p className="font-semibold text-gray-800">
              @{user.userName}{" "}
              <span className="text-xs text-gray-500">
                ({user.email || "no-email"})
              </span>
            </p>
            <p className="text-sm text-gray-500 mt-1">Role: {user.role}</p>
            <div className="mt-2 flex gap-2">
              {user.role === "ADMIN" ? (
                <button
                  onClick={() => handleChangeRole(user.id, "USER")}
                  className="px-2 py-1 text-sm bg-yellow-100 text-yellow-800 rounded"
                >
                  เปลี่ยนเป็น USER
                </button>
              ) : (
                <button
                  onClick={() => handleChangeRole(user.id, "ADMIN")}
                  className="px-2 py-1 text-sm bg-blue-100 text-blue-800 rounded"
                >
                  เปลี่ยนเป็น ADMIN
                </button>
              )}
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="px-2 py-1 text-sm bg-red-100 text-red-800 rounded"
              >
                ลบ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
