import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { revalidatePath } from "next/cache";

import db from "@/utils/db";
import { getProfileById, followUser, unfollowUser } from "./actions";
import { User, CheckCircle } from "lucide-react"; 
import PostCard from "@/components/PostCard";
import StartChatButton from "@/components/chat/StartChatButton";

export const dynamic = "force-dynamic";

type ProfilePageProps = {
  params: Promise<{ id: string }>;
};

// ตัวอย่าง Type สำหรับโพสต์พร้อม relation
interface PostWithRelations {
  id: string;
  name: string;
  description: string;
  images: string[];
  province: string;
  price: number;
  createdAt: string;
  updatedAt: string;
  views: number;
  tags?: string | null;
  status: string;
  profile: {
    id: string;
    clerkId: string;
    firstName: string;
    lastName: string;
    userName: string;
    email: string | null;
    profileImage: string | null;
  };
  category: { id: string; name: string } | null;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  // เรียก getProfileById (ที่ include verification)
  const profile = await getProfileById(id);

  if (!profile) notFound();

  // ตรวจสอบผู้ใช้ที่ล็อกอิน
  const user = await currentUser();
  const currentProfile = user
    ? await db.profile.findUnique({ where: { clerkId: user.id } })
    : null;
  const currentUserId = currentProfile?.id;

  // เป็นเจ้าของโปรไฟล์?
  const isOwner = currentUserId === profile.id;
  // กำลัง Follow อยู่?
  const isFollowing = profile.followers.some(
    (f: { followerId: string }) => f.followerId === currentUserId
  );

  // ตรวจสอบการยืนยันตัวตน
  // เพราะเรา include: { verification: true } จึงมี profile.verification
  // ถ้าผู้ใช้ verified = true => แสดง CheckCircle
  const isVerified = profile.verification?.status === "APPROVED";

  async function handleFollow() {
    "use server";
    if (!currentUserId) throw new Error("You need to login first");
    await followUser(currentUserId, id);
    revalidatePath(`/profile/${id}`);
  }

  async function handleUnfollow() {
    "use server";
    if (!currentUserId) throw new Error("You need to login first");
    await unfollowUser(currentUserId, id);
    revalidatePath(`/profile/${id}`);
  }

  return (
    <main className="relative w-full min-h-screen bg-gray-50">
      {/* Banner Background */}
      <div className="bg-teal-400 h-40 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400" />
      </div>

      {/* Profile Header */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative bg-white rounded-xl shadow-lg p-6 -mt-16">
          {/* รูปโปรไฟล์ */}
          <div className="absolute -top-16 left-6 sm:left-10 w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow-sm">
            {profile.profileImage ? (
              <Image
                src={profile.profileImage}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">
                <User size={50} />
              </div>
            )}
          </div>

          <div className="ml-36 sm:ml-44 mt-2">
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-1">
              {profile.firstName} {profile.lastName}
              {/* หาก Verified => แสดงเช็คสีฟ้า */}
              {isVerified && (
                <CheckCircle
                  className="text-blue-500"
                  size={20}
                  aria-label="Verified"
                />
              )}
            </h1>
            <p className="text-gray-600 -mt-1">@{profile.userName}</p>
            <p className="mt-3 text-sm text-gray-700">
              {profile.bio || "Bio"}
            </p>

            {/* Followers / Following */}
            <div className="flex items-center gap-4 mt-3 text-sm">
              <div>
                <span className="font-semibold">{profile.followers.length}</span>{" "}
                followers
              </div>
              <div>
                <span className="font-semibold">{profile.following.length}</span>{" "}
                following
              </div>
              {profile.badgeRank && (
                <div className="bg-yellow-300 text-yellow-800 px-2 py-1 rounded">
                  Rank: {profile.badgeRank}
                </div>
              )}
            </div>

            {/* ปุ่ม Follow/Unfollow และ Chat */}
            {!isOwner && currentUserId && (
              <div className="mt-4 flex items-center gap-2">
                {!isFollowing ? (
                  <form action={handleFollow}>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition"
                    >
                      Follow
                    </button>
                  </form>
                ) : (
                  <form action={handleUnfollow}>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded cursor-pointer hover:bg-gray-300 transition"
                    >
                      Unfollow
                    </button>
                  </form>
                )}
                <StartChatButton receiverId={profile.id} />
              </div>
            )}

            {isOwner && (
              <div className="mt-4">
                <Link
                  href={`/profile/${profile.id}/edit`}
                  className="px-4 py-2 bg-purple-600 text-white rounded cursor-pointer hover:bg-purple-700 transition"
                >
                  แก้ไขโปรไฟล์
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="max-w-7xl mx-auto mt-8 px-4">
        <h2 className="text-lg font-semibold mb-4">
          Posts ของ {profile.userName}
        </h2>
        {profile.posts.length === 0 ? (
          <p className="text-gray-500">ยังไม่มีโพสต์</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {profile.posts.map((p) => {
              // แปลงวันที่เป็น ISO string
              const createdAt = p.createdAt.toISOString();
              const updatedAt = p.updatedAt.toISOString();

              // cast p เป็น PostWithRelations
              const postData = p as unknown as PostWithRelations;
              return (
                <PostCard
                  key={p.id}
                  post={{
                    id: p.id,
                    name: p.name,
                    description: p.description,
                    images: p.images,
                    province: p.province,
                    price: p.price,
                    createdAt,
                    updatedAt,
                    views: p.views,
                    tags: p.tags,
                    profile: postData.profile,
                    category: postData.category,
                    status: p.status,
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-20" />
    </main>
  );
}
