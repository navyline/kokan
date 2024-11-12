'use client';

import Image from 'next/image';
import Link from 'next/link';

const PostCard = ({ post }) => {
  return (
    <div className="bg-white border border-gray-300 rounded-lg shadow-md transition transform hover:scale-105 hover:shadow-lg overflow-hidden w-full sm:w-72 m-4">
      <Link href={`/posts/${post._id}`}>
        {post.imageUrls && post.imageUrls.length > 0 ? (
          <Image
            src={post.imageUrls[0]}
            alt={post.title.slice(0, 50)} // ใช้แค่ 50 ตัวอักษรแรกเป็น alt
            width={400}
            height={300}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-500">
            <span>No Image</span>
          </div>
        )}
      </Link>
      <div className="p-4">
        <h2 className="font-semibold text-lg text-gray-800 mb-2 truncate">{post.title}</h2>
        <p className="text-sm text-gray-500">Posted by: <span className="font-medium text-gray-700">{post.ownerName}</span></p>
        <p className="text-sm text-gray-500 mt-1">Likes: <span className="font-medium text-gray-700">{Array.isArray(post.likes) ? post.likes.length : 0}</span></p>
      </div>
    </div>
  );
};

export default PostCard;
