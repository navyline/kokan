import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import db from "@/utils/db";
import { getProfileById, followUser, unfollowUser, blockUser, unblockUser } from "./actions";
import { User } from "lucide-react";
import type { Profile } from "@prisma/client";

// ---- PostCardLite: ไม่แสดงข้อมูลโปรไฟล์, แสดงเฉพาะโพสต์ (like/comment/status) ----
type PostLite = {
  id: string;
  name: string;
  image?: string | null;
  likesCount?: number;
  commentsCount?: number;
  status?: string;  
};

function PostCardLite({ post }: { post: PostLite }) {
  return (
    <div className="border rounded-lg shadow bg-white p-4 w-60 flex flex-col gap-2 relative">
      {post.status === "PENDING" && (
        <div className="absolute top-2 left-2 bg-pink-200 text-pink-600 px-2 py-1 rounded text-sm">
          Trade Pending
        </div>
      )}
      {post.image && (
        <div className="relative w-full h-36 overflow-hidden rounded">
          <Link href={`/posts/${post.id}`}>
            <Image src={post.image} alt={post.name} fill className="object-cover" />
          </Link>
        </div>
      )}
      <h2 className="text-sm font-semibold">
        <Link href={`/posts/${post.id}`}>
          <span className="hover:underline">{post.name}</span>
        </Link>
      </h2>
      <div className="flex items-center text-xs text-gray-500 gap-4">
        <span>♥ {post.likesCount ?? 0}</span>
        <span>💬 {post.commentsCount ?? 0}</span>
      </div>
    </div>
  );
}

// ---------------------- หน้าโปรไฟล์หลัก ----------------------
type ProfilePageProps = {
  params: { id: string };
};

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = params;
  const user = await currentUser();
  const profile = await getProfileById(id);
  if (!profile) notFound();

  let currentProfile: Profile | null = null;
  if (user) {
    currentProfile = await db.profile.findUnique({ where: { clerkId: user.id } });
  }

  const isOwner = currentProfile?.id === profile.id;
  const isFollowing = profile.followers.some((f) => f.followerId === currentProfile?.id);
  const heBlockMe = profile.blockedUsers.some((b) => b.blockedId === currentProfile?.id);

  async function handleFollow() {
    "use server";
    if (!currentProfile) throw new Error("You need to login first");
    await followUser(currentProfile.id, id);
    revalidatePath(`/profile/${id}`);
  }
  async function handleUnfollow() {
    "use server";
    if (!currentProfile) throw new Error("You need to login first");
    await unfollowUser(currentProfile.id, id);
    revalidatePath(`/profile/${id}`);
  }
  async function handleBlock() {
    "use server";
    if (!currentProfile) throw new Error("You need to login first");
    await blockUser(currentProfile.id, id);
    revalidatePath(`/profile/${id}`);
  }
  async function handleUnblock() {
    "use server";
    if (!currentProfile) throw new Error("You need to login first");
    await unblockUser(currentProfile.id, id);
    revalidatePath(`/profile/${id}`);
  }

  return (
    <main className="relative w-full min-h-screen bg-gray-50">
      <div className="bg-teal-400 h-40 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400" />
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="relative bg-white rounded-xl shadow-lg p-6 -mt-16">
          <div className="absolute -top-16 left-6 sm:left-10 w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow">
            {profile.profileImage ? (
              <Image src={profile.profileImage} alt="Profile" fill className="object-cover" />
            ) : (
              <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">
                <User size={50} />
              </div>
            )}
          </div>

          <div className="ml-36 sm:ml-44 mt-2">
            <h1 className="text-2xl font-bold text-gray-800">
              {profile.firstName} {profile.lastName}
            </h1>
            <p className="text-gray-600 -mt-1">@{profile.userName}</p>
            <p className="mt-3 text-sm text-gray-700">{profile.bio || "Bio"}</p>

            <div className="flex items-center gap-4 mt-3 text-sm">
              <div>
                <span className="font-semibold">{profile.followers.length}</span> followers
              </div>
              <div>
                <span className="font-semibold">{profile.following.length}</span> following
              </div>
              {profile.badgeRank && (
                <div className="bg-yellow-300 text-yellow-800 px-2 py-1 rounded">
                  Rank: {profile.badgeRank}
                </div>
              )}
            </div>

            {!isOwner && currentProfile && (
              <div className="mt-4 flex items-center gap-2">
                {!isFollowing ? (
                  <form action={handleFollow}>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                      Follow
                    </button>
                  </form>
                ) : (
                  <form action={handleUnfollow}>
                    <button type="submit" className="px-4 py-2 bg-gray-200 text-gray-800 rounded">
                      Unfollow
                    </button>
                  </form>
                )}

                {!heBlockMe ? (
                  <form action={handleBlock}>
                    <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded">
                      Block
                    </button>
                  </form>
                ) : (
                  <form action={handleUnblock}>
                    <button type="submit" className="px-4 py-2 bg-gray-200 text-gray-800 rounded">
                      Unblock
                    </button>
                  </form>
                )}
              </div>
            )}

            {isOwner && (
              <div className="mt-4">
                <Link href={`/profile/${id}/edit`} className="px-4 py-2 bg-purple-600 text-white rounded">
                  แก้ไขโปรไฟล์
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ตัวอย่าง Query ดึง Post มาในรูปแบบ PostLite (likesCount, commentsCount, etc.) */}
      <div className="max-w-4xl mx-auto mt-4 px-4">
        <h2 className="text-lg font-semibold mb-2">
          Posts ของ {profile.userName}
        </h2>
        <div className="flex gap-4 flex-wrap">
          {profile.posts.length === 0 ? (
            <p className="text-gray-500">ยังไม่มีโพสต์</p>
          ) : (
            profile.posts.map((p) => (
              <PostCardLite
                key={p.id}
                post={{
                  id: p.id,
                  name: p.name,
                  image: p.image,
                  likesCount: 5, // mock data
                  commentsCount: 2, // mock data
                  status: "PENDING", // mock data
                }}
              />
            ))
          )}
        </div>
      </div>

      <div className="mt-20" />
    </main>
  );
}
