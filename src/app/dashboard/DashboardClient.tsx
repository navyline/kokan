"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MdOutlineChat } from "react-icons/md";
import { updateTradeStatusAction } from "./actions";
import { Trade, Favorite, Notification } from "@/utils/types";

interface DashboardClientProps {
  trades: Trade[];
  favorites: Favorite[];
  notifications: Notification[];
  currentUserProfileId: string;
}

export default function DashboardClient({
  trades,
  favorites,
  notifications,
  currentUserProfileId,
}: DashboardClientProps) {
  type TabKey = "myTrades" | "favorites" | "notifications" | "offers";
  const [activeTab, setActiveTab] = useState<TabKey>("myTrades");

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-semibold mb-6">แดชบอร์ด</h1>

      <div className="flex gap-4 mb-6 border-b border-gray-200">
        <TabButton label="ข้อเสนอที่ฉันส่ง" active={activeTab === "myTrades"} onClick={() => setActiveTab("myTrades")} />
        <TabButton label="รายการโปรด" active={activeTab === "favorites"} onClick={() => setActiveTab("favorites")} />
        <TabButton label="การแจ้งเตือน" active={activeTab === "notifications"} onClick={() => setActiveTab("notifications")} />
        <TabButton label="ข้อเสนอที่ฉันได้รับ" active={activeTab === "offers"} onClick={() => setActiveTab("offers")} />
      </div>

      {activeTab === "myTrades" && <MyTradesSection trades={trades} currentUserProfileId={currentUserProfileId} />}
      {activeTab === "favorites" && <FavoritesSection favorites={favorites} />}
      {activeTab === "notifications" && <NotificationsSection notifications={notifications} />}
      {activeTab === "offers" && <OffersSection trades={trades} currentUserProfileId={currentUserProfileId} />}
    </div>
  );
}

function TabButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void; }) {
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

function MyTradesSection({ trades, currentUserProfileId }: { trades: Trade[]; currentUserProfileId: string; }) {
  const myTrades = trades.filter((t) => t.offerBy.id === currentUserProfileId);
  if (myTrades.length === 0) {
    return <p className="text-gray-500">ยังไม่มีข้อเสนอที่คุณส่ง</p>;
  }
  return (
    <div className="space-y-4">
      {myTrades.map((trade) => (
        <div key={trade.id} className="border border-gray-200 rounded-md p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
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
            <div className="text-sm text-gray-500">{new Date(trade.createdAt).toLocaleDateString()}</div>
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
            <Link href={`/chat/${trade.id}`} className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium">
              <MdOutlineChat className="text-lg" />
              พูดคุย
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

function OffersSection({ trades, currentUserProfileId }: { trades: Trade[]; currentUserProfileId: string; }) {
  const receivedOffers = trades.filter((t) => t.offerTo.id === currentUserProfileId);
  if (receivedOffers.length === 0) {
    return <p className="text-gray-500">ยังไม่มีข้อเสนอที่คุณได้รับ</p>;
  }
  return (
    <div className="space-y-4">
      {receivedOffers.map((offer) => (
        <div key={offer.id} className="border border-gray-200 rounded-md p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
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
            <div className="text-sm text-gray-500">{new Date(offer.createdAt).toLocaleDateString()}</div>
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
              {/* Form สำหรับ "ยอมรับ" (Accept) */}
              <form action={updateTradeStatusAction} method="post" className="inline">
                <input type="hidden" name="tradeId" value={offer.id} />
                <input type="hidden" name="newStatus" value="ACCEPTED" />
                <button type="submit" className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
                  ยอมรับ
                </button>
              </form>
              {/* Form สำหรับ "ปฏิเสธ" (Reject) */}
              <form action={updateTradeStatusAction} method="post" className="inline">
                <input type="hidden" name="tradeId" value={offer.id} />
                <input type="hidden" name="newStatus" value="REJECTED" />
                <button type="submit" className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
                  ปฏิเสธ
                </button>
              </form>
            </div>
          )}
          <div className="mt-3">
            <Link href={`/chat/${offer.id}`} className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm font-medium">
              <MdOutlineChat className="text-lg" />
              พูดคุย
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

function FavoritesSection({ favorites }: { favorites: Favorite[] }) {
  if (!favorites || favorites.length === 0) {
    return <p className="text-gray-500">ยังไม่มีรายการโปรด</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {favorites.map((fav) => (
        <div key={fav.id} className="border border-gray-200 rounded-md p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <Image
              src={Array.isArray(fav.post?.images) ? fav.post?.images[0] : (fav.post?.images ?? "/default-image.jpg")}
              alt={fav.post?.name || "Post"}
              width={60}
              height={60}
              className="rounded-md object-cover"
            />
            <div className="text-sm">
              <Link href={`/posts/${fav.post?.id}`} className="font-semibold hover:underline text-blue-600">
                {fav.post?.name}
              </Link>
              <p className="text-gray-500">{fav.post?.description?.slice(0, 50)}...</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

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
            <p className="text-xs text-gray-400 mt-1">{new Date(notif.createdAt).toLocaleString()}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
