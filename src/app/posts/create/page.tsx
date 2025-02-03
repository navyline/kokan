"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { createPostAction } from "./actions";

// ✅ ปิด SSR สำหรับ MapLandmark
const MapLandmark = dynamic(() => import("@/components/map/Map"), {
  ssr: false,
});

export default function CreatePost() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { value: "e20dcccd-d509-4d14-90a6-03f7f366ec56", label: "Home Appliances" },
    { value: "4c87dec0-3e31-4947-9701-4f4e58b05c41", label: "Tools" },
    { value: "145e254c-c39d-45a3-9d35-72b0ccae20a9", label: "Electronics" },
    { value: "42e71209-ad6a-494d-b0c4-e2cbc2223fcb", label: "Furniture" },
    { value: "765ed765-ebe4-41a3-9032-06e8928fcfb3", label: "Books" },
    { value: "e29e786a-8fe7-41d5-9524-44010a1eeb5b", label: "Toys" },
    { value: "eec05cbe-baf2-4fe5-bbc2-6694d42e66a1", label: "Clothing" },
    { value: "6a8c3948-512b-407c-9497-cb6b0825b60f", label: "Sports Equipment" },
    { value: "0a2760d2-15d3-4f44-9118-3495b9d8ef07", label: "Other" },
  ];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      const postUrl = await createPostAction(formData);
      router.push(postUrl);
    } catch (error) {
      console.error("❌ Failed to create post:", error);
      setError("An error occurred while creating the post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="p-8 bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 min-h-screen flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl border border-gray-200">
        <h1 className="text-3xl font-extrabold text-center mb-8 bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          Create Your Post
        </h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              placeholder="What are you offering?"
              className="mt-2 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-blue-400 focus:border-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              placeholder="Provide details about your item"
              className="mt-2 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-blue-400 focus:border-blue-400"
              rows={5}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price (THB)</label>
              <input
                type="number"
                name="price"
                placeholder="Enter price"
                className="mt-2 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-blue-400 focus:border-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Province</label>
              <input
                type="text"
                name="province"
                placeholder="e.g., Bangkok"
                className="mt-2 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-blue-400 focus:border-blue-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Condition</label>
            <select
              name="condition"
              className="mt-2 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-blue-400 focus:border-blue-400"
              required
            >
              <option value="">Select condition</option>
              <option value="NEW">New</option>
              <option value="USED">Used</option>
              <option value="LIKE_NEW">Like New</option>
              <option value="REFURBISHED">Refurbished</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              name="category"
              className="mt-2 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-blue-400 focus:border-blue-400"
              required
            >
              <option value="">Select a category</option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="mt-2 block w-full text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-blue-400 focus:border-blue-400"
              required
            />
          </div>

          <MapLandmark />

          <button
            type="submit"
            className={`w-full text-white font-semibold py-3 rounded-lg transition shadow-md ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
            }`}
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit Your Post"}
          </button>
        </form>
      </div>
    </section>
  );
}
