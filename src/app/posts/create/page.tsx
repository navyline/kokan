"use client"

import { useRouter } from "next/navigation";
import MapLandmark from "@/components/map/Map";
import { createPostAction } from "./actions";

export default function CreatePost() {
  const router = useRouter();

  const categories = [
    { value: "1a2b3c4d-5678-90ab-cdef-1234567890ab", label: "Home Appliances" },
    { value: "2b3c4d5e-6789-01ab-cdef-2345678901bc", label: "Tools" },
    { value: "3c4d5e6f-7890-12ab-cdef-3456789012cd", label: "Electronics" },
    { value: "4d5e6f7g-8901-23ab-cdef-4567890123de", label: "Furniture" },
    { value: "5e6f7g8h-9012-34ab-cdef-5678901234ef", label: "Books" },
    { value: "6f7g8h9i-0123-45ab-cdef-6789012345fg", label: "Toys" },
    { value: "7g8h9i0j-1234-56ab-cdef-7890123456gh", label: "Clothing" },
    { value: "8h9i0j1k-2345-67ab-cdef-8901234567hi", label: "Sports Equipment" },
    { value: "9i0j1k2l-3456-78ab-cdef-9012345678ij", label: "Other" },
  ];

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    try {
      // ส่งข้อมูลไปยัง `createPostAction`
      const postUrl = await createPostAction(formData);

      // เปลี่ยนหน้าไปยัง URL ของโพสต์ที่สร้างสำเร็จ
      router.push(postUrl);
    } catch (error) {
      console.error("Failed to create post:", error);
      alert("An error occurred while creating the post.");
    }
  };

  return (
    <section className="p-8 bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 min-h-screen flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl border border-gray-200">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-gradient bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          Create Your Post
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              placeholder="What are you offering?"
              className="mt-2 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-blue-400 focus:border-blue-400 transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              placeholder="Provide details about your item"
              className="mt-2 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-blue-400 focus:border-blue-400 transition"
              rows={5}
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                name="price"
                placeholder="Price in THB"
                className="mt-2 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-blue-400 focus:border-blue-400 transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Province</label>
              <input
                type="text"
                name="province"
                placeholder="e.g., Bangkok"
                className="mt-2 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-blue-400 focus:border-blue-400 transition"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Condition</label>
            <select
              name="condition"
              className="mt-2 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-blue-400 focus:border-blue-400 transition"
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
              className="mt-2 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-blue-400 focus:border-blue-400 transition"
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
              className="mt-2 block w-full text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-blue-400 focus:border-blue-400 transition"
              required
            />
          </div>

          <MapLandmark />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition shadow-md"
          >
            Submit Your Post
          </button>
        </form>
      </div>
    </section>
  );
}
