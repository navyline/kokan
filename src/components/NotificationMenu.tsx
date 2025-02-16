"use client";

import { useState, useEffect, useTransition } from "react";
import { Bell } from "lucide-react";
import { getNotifications, markAllNotificationsAsRead } from "@/app/actions/notificationActions";

interface NotificationType {
  id: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  receiverId: string;
}

export default function NotificationMenu() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [isPending, startTransition] = useTransition();

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  useEffect(() => {
    if (showDropdown && notifications.length === 0) {
      startTransition(async () => {
        const notis = await getNotifications();
        const formattedNotis = notis.map((n) => ({
          ...n,
          createdAt: new Date(n.createdAt).toISOString(),
          updatedAt: new Date(n.updatedAt).toISOString(),
        }));
        setNotifications(formattedNotis);
      });
    }
  }, [showDropdown, notifications.length]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    startTransition(async () => {
      const success = await markAllNotificationsAsRead();
      if (success) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    });
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="p-3 text-gray-600 hover:text-teal-500 transition relative"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 shadow-md rounded-md z-50">
          <div className="flex items-center justify-between px-4 py-2 border-b">
            <span className="font-semibold text-gray-700">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                disabled={isPending}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Mark all as read
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-auto">
            {notifications.length === 0 ? (
              <p className="text-gray-500 px-4 py-2">No notifications found.</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 text-sm border-b last:border-b-0 ${notification.isRead ? "bg-white" : "bg-blue-50"}`}
                >
                  {notification.message}
                  <div className="text-xs text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
