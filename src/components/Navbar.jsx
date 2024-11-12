'use client';

import { useState, Fragment } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, Transition } from '@headlessui/react';

export default function Navbar() {
  const { user, isLoading } = useUser();
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userProfileLink = user ? `/profile/${user.username || user.sub}` : "/api/auth/login";

  return (
    <nav className="bg-white shadow-md py-4 fixed w-full top-0 left-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-3xl font-bold text-gray-900 hover:text-gray-700">
          Kokan
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          <div className="flex-1 flex justify-center space-x-8">
            <Link href="/explore" className="text-lg text-gray-700 hover:text-gray-500">
              Explore
            </Link>
            <Link href="/about" className="text-lg text-gray-700 hover:text-gray-500">
              About
            </Link>
          </div>
          {user && (
            <Link href="/posts/new" className="text-lg text-gray-700 hover:text-gray-500">
              Post
            </Link>
          )}
          {user ? (
            <Menu as="div" className="relative">
              <div>
                <Menu.Button className="flex items-center space-x-2 text-gray-700 hover:text-gray-500">
                  <Image
                    src={user.picture || '/default-profile.png'}
                    alt="Profile Picture"
                    width={40}
                    height={40}
                    className="rounded-full border border-gray-300"
                  />
                  <span className="font-medium">{user.name}</span>
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg py-2">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        href={userProfileLink}
                        className={`block px-4 py-2 text-sm text-gray-800 ${active ? 'bg-gray-100' : ''}`}
                      >
                        Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        href="/api/auth/logout"
                        className={`block px-4 py-2 text-sm text-gray-800 ${active ? 'bg-gray-100' : ''}`}
                      >
                        Sign Out
                      </a>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          ) : (
            <>
              <Link href="/api/auth/login" className="text-lg text-gray-700 hover:text-gray-500">
                Sign In
              </Link>
              <Link href="/api/auth/signup" className="text-lg text-gray-700 hover:text-gray-500">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 hover:text-gray-500 focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16m-7 6h7'}
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-2 px-4 py-4 space-y-2 bg-white border-t border-gray-300">
          <Link href="/explore" className="block text-gray-700 hover:text-gray-500">
            Explore
          </Link>
          <Link href="/about" className="block text-gray-700 hover:text-gray-500">
            About
          </Link>
          {user && (
            <Link href="/posts/new" className="block text-gray-700 hover:text-gray-500">
              Post
            </Link>
          )}
          {user ? (
            <>
              <Link href={userProfileLink} className="block text-gray-700 hover:text-gray-500">
                Profile
              </Link>
              <a
                href="/api/auth/logout"
                className="block text-gray-700 hover:text-gray-500"
              >
                Sign Out
              </a>
            </>
          ) : (
            <>
              <Link href="/api/auth/login" className="block text-gray-700 hover:text-gray-500">
                Sign In
              </Link>
              <Link href="/api/auth/signup" className="block text-gray-700 hover:text-gray-500">
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
