"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';

const ExplorePage = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts'); // Adjust the API endpoint as needed
        const data = await response.json();
        setPosts(data.posts || []);
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
            <div key={post.id} className="bg-white shadow-md rounded-md overflow-hidden">
              <img
                src={post.image || '/path/to/default-image.jpg'}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">{post.title}</h2>
                <p className="text-gray-700 mt-2">{post.description}</p>
                <p className="text-gray-500 mt-2">Location: {post.location}</p>
                <Link href={`/item/${post.id}`} className="text-blue-500 hover:underline">
                  View Details
                </Link>
              </div>
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