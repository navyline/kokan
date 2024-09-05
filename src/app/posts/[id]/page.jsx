"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Correct import for App Router
import Image from 'next/image';

const PostDetail = () => {
  const { id } = useParams(); // Use useParams to get the route parameters
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const response = await fetch(`/api/posts/${id}`);
          const data = await response.json();
          setPost(data);
        } catch (error) {
          console.error('Error fetching post:', error);
        }
      };

      fetchPost();
    }
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      <Image src={post.image} alt={post.title} width={600} height={400} />
      <p>{post.content}</p>
    </div>
  );
};

export default PostDetail;