'use client';

import * as React from 'react';
import { useEdgeStore } from '../../../../lib/edgestore';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import ConditionSelector from '../../../components/ConditionSelector';
import CategorySelector from '../../../components/CategorySelector';

export default function NewPost() {
  const { user } = useUser();
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [condition, setCondition] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [images, setImages] = React.useState([]);
  const { edgestore } = useEdgeStore();
  const router = useRouter();

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedImages = [];
    for (const file of files) {
      try {
        const response = await edgestore.publicFiles.upload({
          file,
          onProgressChange: (progress) => {
            console.log(progress);
          },
        });
        uploadedImages.push(response.url); // Assuming the response contains the URL of the uploaded image
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }
    setImages((prevImages) => [...prevImages, ...uploadedImages]);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const uploadedImages = [];
    for (const file of files) {
      try {
        const response = await edgestore.publicFiles.upload({
          file,
          onProgressChange: (progress) => {
            console.log(progress);
          },
        });
        uploadedImages.push(response.url);
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }
    setImages((prevImages) => [...prevImages, ...uploadedImages]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      title,
      description,
      condition,
      category,
      imageUrls: images,
      owner: user.sub,
      ownerName: user.name,
    };
    const res = await fetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    });
    if (res.ok) {
      router.push('/profile');
    } else {
      console.error('Failed to create post');
    }
  };

  return (
    <div className="container mx-auto p-4">
  <h1 className="text-2xl font-bold mb-4">Create a New Post</h1>
  <form onSubmit={handleSubmit}>
    {/* Title Section */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">ชื่อ</label>
      <input
        type="text"
        className="w-full border border-gray-300 p-2 rounded"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
    </div>

    {/* Description Section */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">คำอธิบาย</label>
      <textarea
        className="w-full border border-gray-300 p-2 rounded"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
    </div>

    {/* Category Section */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">Category</label>
      <CategorySelector onSelectCategory={setCategory} />
    </div>

    {/* Item Condition Section */}
    <div className="mb-4">
      <label className="block text-sm font-medium mb-2">เลือกเงื่อนไข</label>
      <ConditionSelector onSelectCondition={setCondition} />
    </div>

    {/* Add Photos Section */}
    <div
      className="border-2 border-dashed border-gray-300 p-4 rounded-md mb-4"
      onDrop={handleDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <label className="block text-gray-700 mb-2">เพิ่มรูปภาพ (สูงสุด 5 รูป)</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
        id="image-upload"
      />
      <div className="flex flex-wrap gap-4">
        {images.map((image, index) => (
          <div key={index} className="w-24 h-24 relative">
            <img
              src={image}
              alt={`Upload Preview ${index + 1}`}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        ))}
        <label
          htmlFor="image-upload"
          className="w-24 h-24 flex items-center justify-center border border-gray-300 rounded-md cursor-pointer"
        >
          <span className="text-gray-500">+</span>
        </label>
      </div>
    </div>

    <button
      type="submit"
      className="bg-blue-500 text-white p-2 rounded"
    >
      Create Post
    </button>
  </form>
</div>

  );
}