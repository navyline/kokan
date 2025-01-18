"use client";

import { useState, useEffect } from "react";
import { createPostAction, fetchPostsAction, deletePostAction } from "./actions";

const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: "",
    price: 0,
    province: "",
    profileId: "", // ต้องใส่ Profile ID ที่เกี่ยวข้อง
  });

  // ดึงโพสต์เมื่อ Component ถูก mount
  useEffect(() => {
    async function loadPosts() {
      const posts = await fetchPostsAction();
      setPosts(posts);
    }

    loadPosts();
  }, []);

  // ฟังก์ชันสร้างโพสต์
  async function handleCreatePost() {
    await createPostAction(formData);
    const updatedPosts = await fetchPostsAction();
    setPosts(updatedPosts);
  }

  // ฟังก์ชันลบโพสต์
  async function handleDeletePost(postId: string) {
    await deletePostAction(postId);
    const updatedPosts = await fetchPostsAction();
    setPosts(updatedPosts);
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Posts</h1>

      {/* แบบฟอร์มสร้างโพสต์ */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreatePost();
        }}
        className="mb-4"
      >
        <div className="flex flex-col gap-2">
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="p-2 border rounded"
          />
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="p-2 border rounded"
          />
          <input
            type="number"
            placeholder="Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: +e.target.value })}
            className="p-2 border rounded"
          />
          <input
            type="text"
            placeholder="Province"
            value={formData.province}
            onChange={(e) => setFormData({ ...formData, province: e.target.value })}
            className="p-2 border rounded"
          />
          <button
            type="submit"
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Create Post
          </button>
        </div>
      </form>

      {/* รายการโพสต์ */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="p-4 border rounded">
            <h2 className="text-xl font-bold">{post.name}</h2>
            <p>{post.description}</p>
            <p>Price: ${post.price}</p>
            <button
              onClick={() => handleDeletePost(post.id)}
              className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete Post
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostsPage;
