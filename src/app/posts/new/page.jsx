"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import ConditionSelector from '@/components/ConditionSelector';
import CategorySelector from '@/components/CategorySelector';

export default function NewPost() {
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [condition, setCondition] = useState('');
  const [category, setCategory] = useState('');
  const [images, setImages] = useState([]);
  const router = useRouter();

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const res = await fetch('/api/posts/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      console.error('Failed to upload images');
      return;
    }

    try {
      const data = await res.json();
      setImages(data.files);
    } catch (error) {
      console.error('Failed to parse response JSON:', error);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const res = await fetch('/api/posts/upload', {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) {
      console.error('Failed to upload images');
      return;
    }

    try {
      const data = await res.json();
      setImages(data.files);
    } catch (error) {
      console.error('Failed to parse response JSON:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postData = {
      title,
      description,
      condition,
      category,
      images,
      owner: user.sub, // รวม owner จากผู้ใช้ที่ล็อกอินอยู่
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
          <label className="block text-sm font-medium mb-2">Title</label>
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
          <label className="block text-sm font-medium mb-2">Description</label>
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
          <label className="block text-sm font-medium mb-2">Item Condition</label>
          <ConditionSelector onSelectCondition={setCondition} />
        </div>
        {/* Add Photos Section */}
        <div
          className="border-2 border-dashed border-gray-300 p-4 rounded-md mb-4"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <label className="block text-gray-700 mb-2">Add Photos (up to 5)</label>
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
              className="w-24 h-24 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md cursor-pointer"
            >
              <span className="text-gray-500">+</span>
            </label>
          </div>
        </div>
        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/profile')}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
}