"use client"

import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import PostCard from '../../components/PostCard'; // Import the PostCard component

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
        console.log('Fetching posts for user:', user.sub); // Add this line to log the user.sub value
        const response = await fetch('/api/posts'); // Adjust the API endpoint as needed
        const data = await response.json();
        // Filter posts to only include those where the owner matches the logged-in user
        const filteredPosts = data.filter(post => post.owner === user.sub);
        setUserPosts(filteredPosts);
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
        <div>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {userPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
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