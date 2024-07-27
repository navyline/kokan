'use client';

import { useSession } from 'next-auth/react';

const Profile = () => {
  const { data: session } = useSession();

  if (!session) {
    return <p>You need to sign in to view this page</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      <p>Email: {session.user.email}</p>
    </div>
  );
};

export default Profile;
