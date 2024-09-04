"use client"

import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import PostCard from '@/components/PostCard';

export default function Profile() {
    const { user, isLoading } = useUser();
    const [activeTab, setActiveTab] = useState('Posts');
    const [posts, setPosts] = useState([]);
  
    useEffect(() => {
      if (user) {
        fetch(`/api/posts?owner=${user.sub}`)
          .then((res) => res.json())
          .then((data) => setPosts(data))
          .catch((error) => console.error('Failed to fetch posts:', error));
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
      <div className="flex flex-col items-center">
        <Image
          src={user.picture || '/default-profile.png'}
          alt={user.name}
          width={120}
          height={120}
          className="rounded-full border-4 border-white"
        />
        <h1 className="text-2xl font-bold mt-4">{user.name}</h1>
        <p className="text-gray-600">{user.email}</p>
        <p className="text-gray-600">ความสนใจ: {user.interests || 'N/A'}</p>
        <p className="text-gray-600">เทรด: 0 ครั้ง</p>
        <p className="text-gray-600">ผู้ติดตาม: 0 คน</p>
        <p className="text-gray-600">กำลังติดตาม: 0 คน</p>
      </div>

      <div className="mt-8">
        <div className="flex justify-center space-x-4 mb-4">
          {['Posts', 'ISOs', 'Liked', 'Reviews'].map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 rounded-md font-medium text-center ${
                activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex flex-col space-y-4">
          {activeTab === 'Posts' && (
            <div>
              {posts.length === 0 ? (
                <div>
                  <p>ยังไม่มีโพสต์</p>
                  <Link href="/posts/new" className="text-blue-500 hover:underline">
                    Create post
                  </Link>
                </div>
              ) : (
                posts.map((post) => <PostCard key={post._id} post={post} />)
              )}
            </div>
          )}
          {activeTab === 'ISOs' && <p>ISOs content here...</p>}
          {activeTab === 'Liked' && <p>Liked content here...</p>}
          {activeTab === 'Reviews' && <p>Reviews content here...</p>}
        </div>
      </div>
    </div>
  );
}