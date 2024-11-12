"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { useUser } from '@auth0/nextjs-auth0/client';

const PostDetail = () => {
  const { id } = useParams();
  const { user, isLoading } = useUser();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const response = await fetch(`/api/posts/${id}`);
          const data = await response.json();
          setPost(data);
          setComments(data.comments || []);
          setLikes(data.likes || 0);
        } catch (error) {
          console.error('Error fetching post:', error);
        }
      };

      fetchPost();
    }
  }, [id]);

  if (!id) {
    return <div>Error: Invalid Post ID</div>;
  }

  if (!post) {
    return <div>Loading...</div>;
  }

  const isOwnerOrAdmin = user && (post.userId === user.sub || user.role === 'admin');

  const handleLike = async () => {
    try {
      await fetch(`/api/posts/${id}/like`, { method: 'POST' });
      setLikes(likes + 1); // เพิ่มไลค์ในสถานะชั่วคราว
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/posts/${id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newComment, userId: user.sub }),
      });
      const data = await response.json();
      setComments([...comments, data]);
      setNewComment(''); // ล้างช่องคอมเมนต์หลังส่ง
    } catch (error) {
      console.error('Error commenting on post:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col md:flex-row gap-6">
      {/* Left Column: Image and Thumbnail */}
      <div className="flex flex-col gap-2">
        {post.imageUrls && post.imageUrls.length > 0 && (
          <Image src={post.imageUrls[0]} alt={post.title} width={600} height={400} className="rounded-lg" />
        )}
      </div>

      {/* Right Column: Details */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
        <p className="text-gray-700 mb-4">{post.description}</p>

        <div className="mb-4">
          <span className="font-semibold">Category:</span> {post.category || 'Unspecified'}
        </div>
        
        <div className="mb-4">
          <span className="font-semibold">Condition:</span> {post.condition || 'Unspecified'}
        </div>

        <button onClick={handleLike} className="bg-blue-500 text-white px-4 py-2 rounded-lg mt-2">
          Like ({likes})
        </button>

        {/* Comments Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Comments</h2>
          <ul className="space-y-2 mb-4">
            {comments.map((comment, index) => (
              <li key={index} className="p-2 bg-gray-100 rounded-lg">
                {comment.text}
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment"
            className="border p-2 rounded-lg w-full mb-2"
          />
          <button onClick={handleComment} className="bg-green-500 text-white px-4 py-2 rounded-lg">
            Submit
          </button>
        </div>

        {isOwnerOrAdmin && (
          <div className="mt-6 flex gap-4">
            <button onClick={() => handleEdit()} className="bg-yellow-500 text-white px-4 py-2 rounded-lg">
              Edit Post
            </button>
            <button onClick={() => handleDelete()} className="bg-red-500 text-white px-4 py-2 rounded-lg">
              Delete Post
            </button>
          </div>
        )}
      </div>
    </div>
  );

  function handleEdit() {
    console.log('Editing post:', id);
  }

  function handleDelete() {
    console.log('Deleting post:', id);
  }
};

export default PostDetail;
