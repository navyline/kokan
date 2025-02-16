"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// เรียก actions สำหรับดึงข้อมูล
import { checkAdmin, fetchUsers, fetchPosts, fetchVerifications } from "@/app/actions/adminActions";

// import สาม component ย่อย
import UserManagement from "@/components/admin/UserManagement";
import PostManagement from "@/components/admin/PostManagement";
import VerificationManagement from "@/components/admin/VerificationManagement";

import { toast } from "react-hot-toast";

// ประกาศ interface สำหรับ data
interface User {
  id: string;
  email: string | null;
  userName: string;
  role: string;
  // ใส่ field อื่น ๆ ถ้าต้องการ เช่น profileImage
}

interface PostType {
  id: string;
  createdAt: Date;
  name: string;
  status: string;
  // ถ้าโพสต์ต้องแสดงรูป ก็เพิ่ม imageUrls?: string[] เป็นต้น
}

interface Verification {
  id: string;
  userId: string;
  documentUrl: string;
  phone?: string | null;
  address?: string | null;
  // อาจมี firstName/lastName ถ้าบันทึกไว้
}

export default function AdminDashboardPage() {
  const router = useRouter();

  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [verifications, setVerifications] = useState<Verification[]>([]);

  useEffect(() => {
    // โหลดข้อมูลทั้งหมดเมื่อหน้า render
    const fetchData = async () => {
      try {
        const adminCheck = await checkAdmin();
        if (!adminCheck) {
          router.push("/");
          return;
        }
        setIsAdmin(true);

        const [userData, postData, verificationData] = await Promise.all([
          fetchUsers(),
          fetchPosts(),
          fetchVerifications(),
        ]);

        setUsers(userData);
        setPosts(postData);
        setVerifications(verificationData);
      } catch (error: unknown) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("เกิดข้อผิดพลาดในการโหลดข้อมูล");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (!isAdmin && loading) return <p className="text-center p-10">Loading...</p>;
  if (!isAdmin) return null;

  if (loading) return <p className="text-center p-10">Loading data...</p>;

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mb-6">
          จัดการผู้ใช้ โพสต์ และคำขอยืนยันตัวตนในหน้าเดียว
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* ส่วน Users */}
          <UserManagement users={users} setUsers={setUsers} />

          {/* ส่วน Posts */}
          <PostManagement posts={posts} setPosts={setPosts} />

          {/* ส่วน Verification */}
          <VerificationManagement
            verifications={verifications}
            setVerifications={setVerifications}
          />
        </div>
      </div>
    </main>
  );
}
