"use client";

import { updateUserRole, deleteUser } from "@/app/actions/adminActions";

interface User {
  id: string;
  userName: string;
  role: string;
}

export default function UserManagement({ users }: { users: User[] }) {
  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-semibold mb-4">User Management</h2>
      {users.length === 0 ? (
        <p className="text-gray-600">No users found.</p>
      ) : (
        users.map((user) => (
          <div key={user.id} className="border p-4 rounded-md mb-2 flex justify-between">
            <span>{user.userName} ({user.role})</span>
            <div className="flex gap-2">
              <button onClick={() => updateUserRole(user.id, "ADMIN")} className="text-blue-500">Make Admin</button>
              <button onClick={() => deleteUser(user.id)} className="text-red-500">Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
