'use client';

import Image from 'next/image';
import Link from 'next/link';

const PostCard = ({ post }) => {
  return (
    <div className="block max-w-[18rem] rounded-lg bg-white text-surface shadow-secondary-1 dark:bg-surface-dark dark:text-white">
      <div className="relative overflow-hidden bg-cover bg-no-repeat">
        {post.imageUrls && post.imageUrls.length > 0 ? (
          <Image
            src={post.imageUrls[0]}
            alt={post.title}
            width={400}
            height={300}
            className="rounded-t-lg"
          />
        ) : (
          <div className="w-full h-48 bg-gray-200 flex items-center justify-center rounded-t-lg">
            <span>No Image</span>
          </div>
        )}
      </div>
      <div className="p-6">
        <h5 className="mb-2 text-xl font-medium leading-tight">{post.title}</h5>
        <p className="text-base">{post.description}</p>
      </div>
      <ul className="w-full">
        <li className="w-full border-b-2 border-neutral-100 border-opacity-100 px-6 py-3 dark:border-white/10">
          <div className="flex items-center">
            <Image
              src={post.ownerImage}
              alt={post.ownerName}
              width={40}
              height={40}
              className="rounded-full"
            />
            <span className="ml-4">{post.ownerName}</span>
          </div>
        </li>
        <li className="w-full border-b-2 border-neutral-100 border-opacity-100 px-6 py-3 dark:border-white/10">
          <span>{post.likes} likes</span>
        </li>
        <li className="w-full border-neutral-100 border-opacity-100 px-6 py-3 dark:border-white/10">
          <span>{new Date(post.uploadTime).toLocaleString()}</span>
        </li>
      </ul>
      <div className="p-6">
        <Link href={`/posts/${post.id}`} className="pointer-events-auto me-5 inline-block cursor-pointer rounded text-base font-normal leading-normal text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700 dark:text-primary-400">
          Card Link
        </Link>
        <Link href={`/posts/${post.id}`} className="pointer-events-auto inline-block cursor-pointer rounded text-base font-normal leading-normal text-primary transition duration-150 ease-in-out hover:text-primary-600 focus:text-primary-600 focus:outline-none focus:ring-0 active:text-primary-700 dark:text-primary-400">
          Another Link
        </Link>
      </div>
    </div>
  );
};

export default PostCard;