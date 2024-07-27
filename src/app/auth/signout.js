'use client';

import { signOut } from 'next-auth/react';

const SignOut = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl mb-4">Sign Out</h1>
      <button onClick={() => signOut()} className="p-2 bg-blue-500 text-white rounded">
        Sign out
      </button>
    </div>
  );
};

export default SignOut;
