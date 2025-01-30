"use client";

import { useEffect, useState } from "react";
import { checkAdmin } from "@/app/middleware/adminAuth";
import { fetchUsers, fetchPosts, fetchVerifications } from "@/app/actions/adminActions";
import UserManagement from "@/components/admin/UserManagement";
import PostManagement from "@/components/admin/PostManagement";
import VerificationManagement from "@/components/admin/VerificationManagement";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  interface User {
    id: string;
    email: string | null;
    userName: string;
    role: string;
  }

  interface Post {
    id: string;
    createdAt: Date;
    name: string;
    status: string;
  }

  interface Verification {
    id: string;
    userId: string;
    documentUrl: string;
  }
  
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [verifications, setVerifications] = useState<Verification[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const adminCheck = await checkAdmin();
      if (!adminCheck) {
        router.push("/");
        return;
      }

      setIsAdmin(true);
      setUsers(await fetchUsers());
      setPosts(await fetchPosts());
      setVerifications(await fetchVerifications());
    };

    fetchData();
  }, [router]);

  if (!isAdmin) return <p className="text-center p-10">Loading...</p>;

  return (
    <main className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <UserManagement users={users} />
        <PostManagement posts={posts} />
        <VerificationManagement verifications={verifications} />
      </section>
    </main>
  );
}
