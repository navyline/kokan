"use client";

import { useUser } from "@clerk/nextjs";
import { PencilSquareIcon, UserCircleIcon } from "@heroicons/react/24/solid";

export default function ProfilePage() {
  const { user } = useUser();

  return (
    <div className="container mx-auto mt-10 max-w-3xl p-6 bg-white shadow-md rounded-lg">
      {/* Header Section */}
      <div className="flex items-center space-x-6">
        <UserCircleIcon className="h-20 w-20 text-gray-400" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <p className="text-sm text-gray-500">
            Manage your account information and settings
          </p>
        </div>
      </div>

      {/* Profile Details Section */}
      <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 gap-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">First Name</span>
            <span className="text-gray-800 font-medium">{user?.firstName || "N/A"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Last Name</span>
            <span className="text-gray-800 font-medium">{user?.lastName || "N/A"}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Email</span>
            <span className="text-gray-800 font-medium">
              {user?.emailAddresses[0]?.emailAddress || "N/A"}
            </span>
          </div>
        </div>
      </div>

      {/* Profile Picture Section */}
      <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Profile Picture</h2>
        <div className="flex flex-col items-center">
          <img
            src={user?.imageUrl || "/default-avatar.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full shadow-md mb-4"
          />
          <button className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            <PencilSquareIcon className="h-5 w-5" />
            <span>Edit Picture</span>
          </button>
        </div>
      </div>

      {/* Account Settings Section */}
      <div className="mt-6 bg-gray-50 p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Account Settings</h2>
        <ul className="space-y-3">
          <li className="flex items-center justify-between">
            <span className="text-gray-600">Change Password</span>
            <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
              Update
            </button>
          </li>
          <li className="flex items-center justify-between">
            <span className="text-gray-600">Manage Notifications</span>
            <button className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">
              Manage
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}
