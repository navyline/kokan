'use client';

import Image from 'next/image';
import Link from 'next/link';

const PostCard = ({ post }) => {
  return (
    <div className="border rounded-lg shadow-lg overflow-hidden w-64"> {/* ปรับความกว้างของการ์ด */}
      <Link href={`/posts/${post.id}`}>
        {post.imageUrls && post.imageUrls.length > 0 ? (
          <Image
            src={post.imageUrls[0]}
            alt={post.title}
            width={400}
            height={300}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
            <span>No Image</span>
          </div>
        )}
      </Link>
      <div className="p-4">
        <h2 className="font-bold text-xl">{post.title}</h2>
        <p className="text-gray-600">Posted by: {post.owner.name}</p>
        <p className="text-gray-600">Likes: {post.likes.length}</p>
      </div>
    </div>
  );
};

export default PostCard;