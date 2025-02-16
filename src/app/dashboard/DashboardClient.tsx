"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MdOutlineChat } from "react-icons/md";
import { updateTradeStatusAction, deletePostAction } from "./actions";
import { Trade, Favorite, Notification, Post, TradeStatus } from "@/utils/types";

// ------------------------------------
// Props ของ DashboardClient
// ------------------------------------
interface DashboardClientProps {
  trades: Trade[];
  favorites: Favorite[];
  notifications: Notification[];
  posts: Post[];
  currentUserProfileId: string;
}

// ------------------------------------
// DashboardClient Component
// ------------------------------------
export default function DashboardClient({
  trades,
  favorites,
  notifications,
  posts,
  currentUserProfileId,
}: DashboardClientProps) {
  type TabKey = "myTrades" | "favorites" | "notifications" | "offers" | "myPosts";
  const [activeTab, setActiveTab] = useState<TabKey>("myTrades");

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6">แดชบอร์ด</h1>

      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <TabButton
          label="ข้อเสนอที่ฉันส่ง"
          active={activeTab === "myTrades"}
          onClick={() => setActiveTab("myTrades")}
        />
        <TabButton
          label="รายการโปรด"
          active={activeTab === "favorites"}
          onClick={() => setActiveTab("favorites")}
        />
        <TabButton
          label="การแจ้งเตือน"
          active={activeTab === "notifications"}
          onClick={() => setActiveTab("notifications")}
        />
        <TabButton
          label="ข้อเสนอที่ฉันได้รับ"
          active={activeTab === "offers"}
          onClick={() => setActiveTab("offers")}
        />
        <TabButton
          label="โพสของฉัน"
          active={activeTab === "myPosts"}
          onClick={() => setActiveTab("myPosts")}
        />
      </div>

      {activeTab === "myTrades" && (
        <MyTradesSection
          trades={trades}
          currentUserProfileId={currentUserProfileId}
        />
      )}
      {activeTab === "favorites" && <FavoritesSection favorites={favorites} />}
      {activeTab === "notifications" && (
        <NotificationsSection notifications={notifications} />
      )}
      {activeTab === "offers" && (
        <OffersSection trades={trades} currentUserProfileId={currentUserProfileId} />
      )}
      {activeTab === "myPosts" && <MyPostsSection posts={posts} />}
    </div>
  );
}

// ------------------------------------
// ส่วนประกอบย่อย (TabButton)
// ------------------------------------
function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`pb-2 px-2 border-b-2 font-medium ${
        active ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-blue-500"
      }`}
    >
      {label}
    </button>
  );
}

// ------------------------------------
// สไตล์ของสถานะ Trade
// ------------------------------------
const getStatusStyle = (status: string) => {
  switch (status) {
    case "ACCEPTED":
      return "text-green-600 bg-green-100 px-2 py-1 rounded-md";
    case "REJECTED":
      return "text-red-600 bg-red-100 px-2 py-1 rounded-md";
    case "PENDING":
      return "text-yellow-600 bg-yellow-100 px-2 py-1 rounded-md";
    case "CANCELLED":
      return "text-gray-600 bg-gray-100 px-2 py-1 rounded-md";
    case "COMPLETED":
      return "text-blue-600 bg-blue-100 px-2 py-1 rounded-md";
    default:
      return "text-gray-600";
  }
};

const translateStatus = (status: string) => {
  switch (status) {
    case "ACCEPTED":
      return "ยอมรับแล้ว";
    case "REJECTED":
      return "ถูกปฏิเสธ";
    case "PENDING":
      return "รอดำเนินการ";
    case "CANCELLED":
      return "ยกเลิก";
    case "COMPLETED":
      return "เสร็จสมบูรณ์";
    default:
      return "ไม่ทราบสถานะ";
  }
};

// ------------------------------------
// 1) MyTradesSection (ข้อเสนอที่ฉันส่ง)
// ------------------------------------
function MyTradesSection({
  trades,
  currentUserProfileId,
}: {
  trades: Trade[];
  currentUserProfileId: string;
}) {
  const myTrades = trades.filter((t) => t.offerBy.id === currentUserProfileId);

  if (myTrades.length === 0) {
    return <p className="text-gray-500">ยังไม่มีข้อเสนอที่คุณส่ง</p>;
  }

  return (
    <div className="space-y-4">
      {myTrades.map((trade) => (
        <div
          key={trade.id}
          className="border border-gray-200 rounded-md p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Image
                src={trade.offerTo?.profileImage ?? "/default-profile.png"}
                alt="profile"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <p className="text-sm text-gray-700 font-medium">
                ผู้รับข้อเสนอ:{" "}
                <Link href={`/profile/${trade.offerTo?.id}`} className="font-semibold hover:underline text-blue-600">
                  {trade.offerTo?.firstName} {trade.offerTo?.lastName}
                </Link>
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {new Date(trade.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="text-gray-700 text-sm space-y-1">
            <p>
              <span className="font-medium">ของที่คุณเสนอ: </span>
              {trade.postOffered ? (
                <Link href={`/posts/${trade.postOffered.id}`} className="text-blue-600 hover:underline">
                  {trade.postOffered.name}
                </Link>
              ) : (
                "ไม่มีข้อมูล"
              )}
            </p>
            <p>
              <span className="font-medium">ต้องการแลกกับ: </span>
              {trade.postWanted ? (
                <Link href={`/posts/${trade.postWanted.id}`} className="text-blue-600 hover:underline">
                  {trade.postWanted.name}
                </Link>
              ) : (
                "ไม่มีข้อมูล"
              )}
            </p>
            <p>
              <span className="font-medium">สถานะ: </span>
              <span className={getStatusStyle(trade.status)}>{translateStatus(trade.status)}</span>
            </p>
          </div>
          <div className="mt-3">
            <Link
              href={`/chats`}
              className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium"
            >
              <MdOutlineChat className="text-lg" />
              พูดคุย
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

// ------------------------------------
// 2) OffersSection (ข้อเสนอที่ฉันได้รับ) - อัปเดตสถานะทันทีโดยไม่รีเฟรช
// ------------------------------------
function OffersSection({
  trades,
  currentUserProfileId,
}: {
  trades: Trade[];
  currentUserProfileId: string;
}) {
  // ใช้ local state เพื่อเก็บข้อเสนอที่ได้รับ
  const [offers, setOffers] = useState(
    trades.filter((t) => t.offerTo.id === currentUserProfileId)
  );
  const [loadingTradeId, setLoadingTradeId] = useState<string | null>(null);

  const handleUpdateStatus = async (tradeId: string, newStatus: string) => {
    setLoadingTradeId(tradeId);
    const formData = new FormData();
    formData.append("tradeId", tradeId);
    formData.append("newStatus", newStatus);
    try {
      await updateTradeStatusAction(formData);
      // อัปเดตสถานะใน local state ทันที
      setOffers((prevOffers) =>
        prevOffers.map((offer) =>
          offer.id === tradeId ? { ...offer, status: newStatus as TradeStatus } : offer
        )
      );
      
    } catch (error) {
      console.error("Error updating trade status:", error);
    } finally {
      setLoadingTradeId(null);
    }
  };

  if (offers.length === 0) {
    return <p className="text-gray-500">ยังไม่มีข้อเสนอที่คุณได้รับ</p>;
  }

  return (
    <div className="space-y-4">
      {offers.map((offer) => (
        <div
          key={offer.id}
          className="border border-gray-200 rounded-md p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Image
                src={offer.offerBy?.profileImage ?? "/default-profile.png"}
                alt="profile"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <p className="text-sm text-gray-700 font-medium">
                ข้อเสนอจาก:{" "}
                <Link href={`/profile/${offer.offerBy?.id}`} className="font-semibold hover:underline text-blue-600">
                  {offer.offerBy?.firstName} {offer.offerBy?.lastName}
                </Link>
              </p>
            </div>
            <div className="text-sm text-gray-500">
              {new Date(offer.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="text-gray-700 text-sm space-y-1">
            <p>
              <span className="font-medium">ของที่เสนอ: </span>
              {offer.postOffered ? (
                <Link href={`/posts/${offer.postOffered.id}`} className="text-blue-600 hover:underline">
                  {offer.postOffered.name}
                </Link>
              ) : (
                "ไม่มีข้อมูล"
              )}
            </p>
            <p>
              <span className="font-medium">ต้องการแลกกับ: </span>
              {offer.postWanted ? (
                <Link href={`/posts/${offer.postWanted.id}`} className="text-blue-600 hover:underline">
                  {offer.postWanted.name}
                </Link>
              ) : (
                "ไม่มีข้อมูล"
              )}
            </p>
            <p>
              <span className="font-medium">สถานะ: </span>
              <span className={getStatusStyle(offer.status)}>{translateStatus(offer.status)}</span>
            </p>
          </div>
          {offer.status === "PENDING" && (
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleUpdateStatus(offer.id, "ACCEPTED")}
                disabled={loadingTradeId === offer.id}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
              >
                {loadingTradeId === offer.id ? "Processing..." : "ยอมรับ"}
              </button>
              <button
                onClick={() => handleUpdateStatus(offer.id, "REJECTED")}
                disabled={loadingTradeId === offer.id}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                {loadingTradeId === offer.id ? "Processing..." : "ปฏิเสธ"}
              </button>
            </div>
          )}
          <div className="mt-3">
            <Link
              href={`/chats`}
              className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium"
            >
              <MdOutlineChat className="text-lg" />
              พูดคุย
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

// ------------------------------------
// 3) FavoritesSection
// ------------------------------------
function FavoritesSection({ favorites }: { favorites: Favorite[] }) {
  if (!favorites || favorites.length === 0) {
    return <p className="text-gray-500">ยังไม่มีรายการโปรด</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {favorites.map((fav) => (
        <div
          key={fav.id}
          className="border border-gray-200 rounded-md p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center gap-3">
            <Image
              src={
                Array.isArray(fav.post?.images)
                  ? fav.post?.images[0] || "/default-image.jpg"
                  : fav.post?.images ?? "/default-image.jpg"
              }
              alt={fav.post?.name || "Post"}
              width={60}
              height={60}
              className="rounded-md object-cover"
            />
            <div className="text-sm">
              <Link
                href={`/posts/${fav.post?.id}`}
                className="font-semibold hover:underline text-blue-600"
              >
                {fav.post?.name}
              </Link>
              <p className="text-gray-500">
                {fav.post?.description?.slice(0, 50)}...
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ------------------------------------
// 4) NotificationsSection
// ------------------------------------
function NotificationsSection({ notifications }: { notifications: Notification[] }) {
  if (!notifications || notifications.length === 0) {
    return <p className="text-gray-500">ไม่มีการแจ้งเตือน</p>;
  }
  return (
    <div className="space-y-3">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`border border-gray-200 rounded-md px-4 py-3 bg-white flex items-start justify-between shadow-sm hover:shadow-md transition-shadow ${
            !notif.isRead ? "bg-gray-50" : ""
          }`}
        >
          <div>
            <p className="text-gray-700 text-sm">{notif.message}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(notif.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ------------------------------------
// 5) MyPostsSection (โพสของฉัน)
// ------------------------------------
function MyPostsSection({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <p className="text-gray-500">ยังไม่มีโพสที่คุณสร้าง</p>;
  }
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="border border-gray-200 rounded-md p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          {Array.isArray(post.images) && post.images.length > 0 ? (
            <Image
              src={post.images[0]}
              alt={post.name}
              width={80}
              height={80}
              className="rounded-md object-cover mb-2"
            />
          ) : (
            <Image
              src="/default-image.jpg"
              alt={post.name}
              width={80}
              height={80}
              className="rounded-md object-cover mb-2"
            />
          )}
          <div className="flex justify-between items-center mb-2">
            <Link
              href={`/posts/${post.id}`}
              className="text-lg font-semibold text-blue-600 hover:underline"
            >
              {post.name}
            </Link>
            <span className="text-xs text-gray-500">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
          <p className="text-gray-700 text-sm mb-2">{post.description}</p>
          <div className="flex gap-4">
            <Link
              href={`/posts/${post.id}/edit`}
              className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm"
            >
              แก้ไข
            </Link>
            <form action={deletePostAction}>
              <input type="hidden" name="postId" value={post.id} />
              <button
                type="submit"
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
              >
                ลบ
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
