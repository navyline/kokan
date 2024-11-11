"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // ใช้ useParams แทน useRouter
import Image from 'next/image';

const PostDetail = () => {
  const { id } = useParams(); // ดึง id จาก URL
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

  if (!id) {
    return <div>Error: Invalid Post ID</div>; // ถ้า id ไม่มีค่าจะแสดงข้อความนี้
  }

  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{post.title}</h1>
      {post.imageUrls && post.imageUrls.length > 0 && (
        <Image src={post.imageUrls[0]} alt={post.title} width={600} height={400} />
      )}
      <p>{post.description}</p>
    </div>
  );
};

export default PostDetail;
