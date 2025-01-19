import MapLandmark from "@/components/map/Map";
import { createPostAction } from "./actions";

export default function CreatePost() {
  const categories = [
    { value: "home-appliances", label: "Home Appliances" },
    { value: "tools", label: "Tools" },
    { value: "electronics", label: "Electronics" },
    { value: "furniture", label: "Furniture" },
    { value: "sports-equipment", label: "Sports Equipment" },
    { value: "books", label: "Books" },
    { value: "toys", label: "Toys" },
    { value: "clothing", label: "Clothing" },
    { value: "other", label: "Other" },
  ];

  return (
    <section className="p-8 bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 min-h-screen flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl border border-gray-200">
        <h1 className="text-3xl font-extrabold text-center mb-8 text-gradient bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text">
          Create Your Post
        </h1>
        <form
          action={createPostAction}
          className="space-y-6"
        >
          {/* Name Field */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="What are you offering?"
              className="mt-2 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-blue-400 focus:border-blue-400 transition"
              required
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Provide details about your item"
              className="mt-2 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-blue-400 focus:border-blue-400 transition"
              rows={5}
              required
            ></textarea>
          </div>

          {/* Price Field */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                name="price"
                placeholder="Price in THB"
                className="mt-2 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-blue-400 focus:border-blue-400 transition"
                required
              />
            </div>

            {/* Province Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Province
              </label>
              <input
                type="text"
                name="province"
                placeholder="e.g., Bangkok"
                className="mt-2 block w-full border border-gray-300 rounded-lg p-3 shadow-sm focus:ring-blue-400 focus:border-blue-400 transition"
                required
              />
            </div>
          </div>

          {/* Category Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Category
            </label>
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

          {/* Image Upload Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Image
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              className="mt-2 block w-full text-sm border border-gray-300 rounded-lg shadow-sm focus:ring-blue-400 focus:border-blue-400 transition"
              required
            />
          </div>

          {/* Map Component */}
          <MapLandmark />

          {/* Submit Button */}
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
