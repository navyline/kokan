"use client";

import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import PostCard from '../../components/PostCard';
import { FaUserCircle, FaPlus, FaFileAlt, FaStar, FaHeart, FaCommentDots } from 'react-icons/fa';

export default function Profile() {
  const { user, isLoading } = useUser();
  const [activeTab, setActiveTab] = useState('Posts');
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      try {
        if (!user || !user.sub) {
          console.error('User or user.sub is undefined');
          return;
        }
        
        const response = await fetch(`/api/posts?owner=${user.sub}`);
        const data = await response.json();

        if (response.ok) {
          setUserPosts(data);
        } else {
          console.error('Failed to fetch posts:', data.message || 'Unknown error');
        }
      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    if (user) {
      fetchUserPosts();
    }
  }, [user]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>You need to be logged in to view this page.</p>
        <Link href="/api/auth/login" className="text-blue-500 hover:underline">
          Log in
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 container mx-auto px-4 py-8">
      <div className="bg-teal-200 py-12 relative">
        <div className="absolute top-0 left-0 right-0 bottom-0 bg-teal-200"></div>
        <div className="relative z-10 flex flex-col items-center justify-center">
          <div className="w-full flex justify-center">
            <Image
              src={user.picture || '/default-profile.png'}
              alt={user.name}
              width={120}
              height={120}
              className="rounded-full border-4 border-white"
            />
          </div>
          <h1 className="text-2xl font-bold mt-4 text-center">{user.name}</h1>
          <div className="text-gray-600 mt-2 text-center">
            <p><FaUserCircle className="inline mr-1" /> @{user.nickname}</p>
            <p>Interests: {user.interests || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex justify-center space-x-4 my-6">
        {[ 
          { tab: 'Posts', icon: <FaFileAlt /> },
          { tab: 'ISOs', icon: <FaCommentDots /> },
          { tab: 'Liked', icon: <FaHeart /> },
          { tab: 'Reviews', icon: <FaStar /> },
        ].map(({ tab, icon }) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-md font-medium flex items-center ${
              activeTab === tab ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {icon}
            <span className="ml-2">{tab}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'Posts' && (
          <div className="flex flex-col items-center">
            {userPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {userPosts.map((post) => (
                  <Link key={post._id} href={`/posts/${post._id}`}>
                    <PostCard post={post} />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-24 h-24 bg-purple-100 rounded-md flex items-center justify-center">
                    <FaPlus className="text-purple-500 text-4xl" />
                  </div>
                </div>
                <p>You don’t have any posts yet</p>
                <Link href="/create-post" className="text-blue-500 hover:underline">
                  Create post
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
