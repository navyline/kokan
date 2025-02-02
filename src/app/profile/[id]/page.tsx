import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import db from "@/utils/db";
import { getProfileById, followUser, unfollowUser } from "./actions";
import { User } from "lucide-react";
import PostCardLite from "@/components/posts/PostCardLite";
import StartChatButton from "@/components/chat/StartChatButton";

export const dynamic = "force-dynamic";

type ProfilePageProps = {
  params: Promise<{ id: string }>;
};

interface Post {
  id: string;
  name: string;
  image?: string | null;
  favorites?: { id: string }[];
  comments?: { id: string }[];
  status: string;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const profile = await getProfileById(id);

  if (!profile) notFound();

  // ✅ ตรวจสอบผู้ใช้ที่ล็อกอิน
  const user = await currentUser();
  const currentProfile = user ? await db.profile.findUnique({ where: { clerkId: user.id } }) : null;
  const currentUserId = currentProfile?.id;

  // ✅ ตรวจสอบว่าเป็นเจ้าของโปรไฟล์หรือไม่
  const isOwner = currentUserId === profile.id;
  const isFollowing = profile.followers.some((f: { followerId: string }) => f.followerId === currentUserId);

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
      <div className="bg-teal-400 h-40 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-cyan-400" />
      </div>

      <div className="max-w-4xl mx-auto px-4">
        <div className="relative bg-white rounded-xl shadow-lg p-6 -mt-16">
          <div className="absolute -top-16 left-6 sm:left-10 w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow-sm">
            {profile.profileImage ? (
              <Image src={profile.profileImage} alt="Profile" fill className="object-cover" />
            ) : (
              <div className="bg-gray-200 w-full h-full flex items-center justify-center text-gray-500">
                <User size={50} />
              </div>
            )}
          </div>

          <div className="ml-36 sm:ml-44 mt-2">
            <h1 className="text-2xl font-bold text-gray-800">{profile.firstName} {profile.lastName}</h1>
            <p className="text-gray-600 -mt-1">@{profile.userName}</p>
            <p className="mt-3 text-sm text-gray-700">{profile.bio || "Bio"}</p>

            <div className="flex items-center gap-4 mt-3 text-sm">
              <div><span className="font-semibold">{profile.followers.length}</span> followers</div>
              <div><span className="font-semibold">{profile.following.length}</span> following</div>
              {profile.badgeRank && <div className="bg-yellow-300 text-yellow-800 px-2 py-1 rounded">Rank: {profile.badgeRank}</div>}
            </div>

            {/* ✅ ปุ่มติดตาม / ยกเลิกติดตาม + ปุ่มแชท */}
            {!isOwner && currentUserId && (
              <div className="mt-4 flex items-center gap-2">
                {!isFollowing ? (
                  <form action={handleFollow}>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition">
                      Follow
                    </button>
                  </form>
                ) : (
                  <form action={handleUnfollow}>
                    <button type="submit" className="px-4 py-2 bg-gray-200 text-gray-800 rounded cursor-pointer hover:bg-gray-300 transition">
                      Unfollow
                    </button>
                  </form>
                )}

                {/* ✅ ใช้ปุ่ม StartChatButton ที่เป็น Client Component */}
                <StartChatButton receiverId={profile.id} />
              </div>
            )}

            {isOwner && (
              <div className="mt-4">
                <Link href={`/profile/${id}/edit`} className="px-4 py-2 bg-purple-600 text-white rounded cursor-pointer hover:bg-purple-700 transition">
                  แก้ไขโปรไฟล์
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mt-4 px-4">
        <h2 className="text-lg font-semibold mb-2">Posts ของ {profile.userName}</h2>
        <div className="flex gap-4 flex-wrap">
          {profile.posts.length === 0 ? (
            <p className="text-gray-500">ยังไม่มีโพสต์</p>
          ) : (
            profile.posts.map((p: Post) => (
              <PostCardLite
                key={p.id}
                post={{
                  id: p.id,
                  name: p.name,
                  image: p.image,
                  likesCount: p.favorites?.length || 0,
                  commentsCount: p.comments?.length || 0,
                  status: p.status,
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
