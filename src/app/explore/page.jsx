"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts'); // Adjust the API endpoint as needed
        const data = await response.json();
        setPosts(data.posts || []); // Ensure posts is always an array
      } catch (error) {
        console.error('Error fetching posts:', error);
        setPosts([]); // Ensure posts is always an array
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Explore</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-gray-700 mb-4">{post.description}</p>
              <Link href={`/posts/${post._id}`}>
                <a className="text-blue-500 hover:underline">Read more</a>
              </Link>
            </div>
          ))
        ) : (
          <p>No posts available</p>
        )}
      </div>
    </div>
  );
};

export default ExplorePage;
