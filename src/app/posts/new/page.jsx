"use client";

import * as React from 'react';
import { useEdgeStore } from '../../../../lib/edgestore';
import { useRouter } from 'next/navigation';
import { useUser } from '@auth0/nextjs-auth0/client';
import ConditionSelector from '../../../components/ConditionSelector';
import CategorySelector from '../../../components/CategorySelector';
import { FaRegSmile, FaPhotoVideo } from 'react-icons/fa';

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
    <div className="container mx-auto p-8 max-w-2xl" style={{ backgroundColor: '#f7f7f7' }}>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Create a New Post</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        
        {/* Title Section */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            type="text"
            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <FaRegSmile className="absolute top-3 right-3 text-gray-400" />
        </div>

        {/* Description Section */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            className="w-full border border-gray-300 p-3 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe your item or write a public message"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <FaRegSmile className="absolute top-3 right-3 text-gray-400" />
        </div>

        {/* Category Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <CategorySelector onSelectCategory={setCategory} />
        </div>

        {/* Item Condition Section */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Item Condition</label>
          <ConditionSelector onSelectCondition={setCondition} />
        </div>

        {/* Add Photos Section */}
        <div
          className="border-2 border-dashed border-gray-300 p-6 rounded-lg mb-6 flex flex-col items-center justify-center"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <label className="block text-gray-700 mb-2">Add photos</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <div className="flex flex-wrap gap-4 mb-2">
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
              <FaPhotoVideo className="text-gray-500 text-3xl" />
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-yellow-500 text-white p-3 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300"
        >
          Post
        </button>
      </form>
    </div>
  );
}
