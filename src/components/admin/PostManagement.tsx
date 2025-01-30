"use client";

import { deletePost, hidePost } from "@/app/actions/adminActions";

interface Post {
  id: string;
  name: string;
}

export default function PostManagement({ posts }: { posts: Post[] }) {
  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Post Management</h2>
      {posts.length === 0 ? (
        <p className="text-gray-600">No posts available.</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="border p-4 rounded-md mb-2 flex justify-between">
            <span>{post.name}</span>
            <div className="flex gap-2">
              <button onClick={() => hidePost(post.id)} className="text-yellow-500">Hide</button>
              <button onClick={() => deletePost(post.id)} className="text-red-500">Delete</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
