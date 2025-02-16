import { notFound } from "next/navigation";
import { fetchUserDashboardData } from "./actions";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  // เรียกใช้ฟังก์ชันดึงข้อมูลแดชบอร์ด
  const data = await fetchUserDashboardData();
  if (!data) {
    notFound();
  }

  const profileId = data.profileId ?? "";

  // แปลงข้อมูล trades
  const trades = (data.trades ?? []).map((trade) => ({
    ...trade,
    createdAt: new Date(trade.createdAt).toISOString(),
    updatedAt: new Date(trade.updatedAt).toISOString(),
    postOffered: trade.postOffered
      ? {
          ...trade.postOffered,
          createdAt: new Date(trade.postOffered.createdAt).toISOString(),
          updatedAt: new Date(trade.postOffered.updatedAt).toISOString(),
        }
      : null,
    postWanted: trade.postWanted
      ? {
          ...trade.postWanted,
          createdAt: new Date(trade.postWanted.createdAt).toISOString(),
          updatedAt: new Date(trade.postWanted.updatedAt).toISOString(),
        }
      : null,
  }));

  // แปลงข้อมูล favorites
  const favorites = (data.favorites ?? []).map((fav) => ({
    ...fav,
    post: fav.post
      ? {
          ...fav.post,
          createdAt: new Date(fav.post.createdAt).toISOString(),
          updatedAt: new Date(fav.post.updatedAt).toISOString(),
        }
      : null,
  }));

  // แปลงข้อมูล posts
  const posts = (data.posts ?? []).map((post) => ({
    ...post,
    createdAt: new Date(post.createdAt).toISOString(),
    updatedAt: new Date(post.updatedAt).toISOString(),
  }));

  const notifications = data.notifications ?? [];

  return (
    <DashboardClient
      trades={trades}
      favorites={favorites}
      notifications={notifications}
      posts={posts}
      currentUserProfileId={profileId}
    />
  );
}
