'use client';

import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-blue-500 p-4 text-white flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-lg font-bold">
          Kokan
        </Link>
        <Link href="/product/list" className="text-lg">
          Products
        </Link>
        {session && (
          <Link href="/product/add" className="text-lg">
            Add Product
          </Link>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {status === 'loading' ? (
          <p>Loading...</p>
        ) : session ? (
          <>
            <Link href="/profile" className="text-lg">
              Profile
            </Link>
            <button onClick={() => signOut()} className="text-lg">
              Sign Out
            </button>
          </>
        ) : (
          <button onClick={() => signIn()} className="text-lg">
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
