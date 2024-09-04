import Link from 'next/link';

const HomePage = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="bg-cover bg-center h-80 text-center text-white" style={{ backgroundImage: 'url(/path/to/image.jpg)' }}>
        <div className="flex flex-col justify-center h-full bg-black bg-opacity-50">
          <h1 className="text-4xl font-bold mb-4">Welcome to Kokan</h1>
          <p className="text-lg mb-6">Discover and exchange items with your local community</p>
          <Link href="/explore" className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Start Exploring
          </Link>
        </div>
      </div>

      {/* Featured Listings */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Featured Listings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample Item Card */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <img
              src="/path/to/image.jpg"
              alt="Item Image"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold">Item Title</h3>
              <p className="text-gray-700 mt-2">Short description of the item.</p>
              <Link href="/item/1" className="text-blue-500 mt-4 block">
                View Details
              </Link>
            </div>
          </div>
          {/* More items... */}
        </div>
      </div>

      {/* News and Updates */}
      <div className="bg-gray-100 py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Latest News</h2>
          <div className="space-y-4">
            {/* Sample News Item */}
            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-xl font-semibold">News Title</h3>
              <p className="text-gray-700 mt-2">Short summary of the news or update.</p>
              <Link href="/news/1" className="text-blue-500 mt-2 block">
                Read More
              </Link>
            </div>
            {/* More news items... */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
