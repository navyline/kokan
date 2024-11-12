'use client';

import React, { useEffect, useState } from 'react';
import PostCard from '../../components/PostCard'; // นำเข้า PostCard
import { useRouter } from 'next/navigation';

const Explore = () => {
  const [posts, setPosts] = useState([]);
  const router = useRouter();

  // ฟังก์ชั่นดึงข้อมูลโพสต์ทั้งหมดจาก API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts'); // สมมติว่า API นี้จะคืนข้อมูลโพสต์ทั้งหมด
        const data = await response.json();
        setPosts(data); // เก็บข้อมูลโพสต์ลงใน state
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto p-8 max-w-screen-xl">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Explore All Posts</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* แสดง PostCard สำหรับแต่ละโพสต์ */}
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))
        ) : (
          <div className="text-center col-span-full">
            <p>No posts available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
