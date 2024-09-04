import Link from 'next/link';

const ExplorePage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Explore</h1>
      
      {/* Search and Filter Section */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-3 border border-gray-300 rounded-md"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Sample Item Card */}
        <div className="bg-white shadow-md rounded-md overflow-hidden">
          <img
            src="/path/to/image.jpg"
            alt="Item Image"
            className="w-full h-48 object-cover"
          />
          <div className="p-4">
            <h2 className="text-xl font-semibold">Item Title</h2>
            <p className="text-gray-700 mt-2">Short description of the item.</p>
            <p className="text-gray-500 mt-2">Location: City</p>
            <Link href="/item/1" className="text-blue-500 hover:underline">
              View Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExplorePage;