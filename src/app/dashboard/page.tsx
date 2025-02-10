import { notFound } from "next/navigation";
import { fetchUserDashboardData } from "./actions";
import DashboardClient from "./DashboardClient";

/**
 * หน้า Dashboard (Server Component)
 * ดึงข้อมูล Dashboard แล้วส่งไปยัง Client Component
 */
export default async function DashboardPage() {
  const data = await fetchUserDashboardData();
  if (!data) {
    notFound();
  }

  const profileId = data.profileId ?? "";

  // แปลงข้อมูลของ trades ให้ createdAt, updatedAt เป็น ISO string
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

  // แปลงข้อมูลของ favorites ให้ createdAt, updatedAt ของ post เป็น ISO string
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

  const notifications = data.notifications ?? [];

  return (
    <DashboardClient
      trades={trades}
      favorites={favorites}
      notifications={notifications}
      currentUserProfileId={profileId}
    />
  );
}
