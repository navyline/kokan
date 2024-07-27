'use client';

import { signIn } from 'next-auth/react';

const SignIn = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl mb-4">Sign In</h1>
      <button onClick={() => signIn('google')} className="p-2 bg-blue-500 text-white rounded">
        Sign in with Google
      </button>
    </div>
  );
};

export default SignIn;
