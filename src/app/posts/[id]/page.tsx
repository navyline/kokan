import { fetchPostDetail } from "./actions";
import FavoriteToggleButton from "@/components/posts/FavoriteToggleButton";
import Breadcrums from "@/components/posts/Breadcrums";
import ShareButton from "@/components/posts/ShareButton";
import MapLandmark from "@/components/map/Map";
import { redirect } from "next/navigation";
import Image from "next/image";

const PostDetail = async ({ params }: { params: { id: string } }) => {
  const { id } = await params;
  const post = await fetchPostDetail({ id });
  if (!post) redirect("/");

  return (
    <section className="p-8 bg-gray-50 min-h-screen">
      {/* Breadcrumbs */}
      <Breadcrums name={post.name} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Image Section */}
        <div className="md:col-span-2">
          <div className="flex flex-col items-center">
            <div className="relative w-full h-96 mb-4">
              <Image
                src={post.image || '/default-image.jpg'}
                alt={post.name}
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <div className="flex gap-2">
              {/* Add thumbnail images if available */}
              <Image
                src={post.image || '/default-image.jpg'}
                alt="Thumbnail"
                width={60}
                height={60}
                className="rounded-md border"
              />
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">{post.name}</h1>
          <p className="text-gray-600 mb-2">{post.description}</p>
          <p className="font-semibold text-gray-800 mb-2">Category: Bedroom</p>
          <p className="font-semibold text-gray-800 mb-4">
            Tags: <span className="text-blue-500">#blanket #bedding</span>
          </p>

          {/* Condition */}
          <div className="bg-blue-50 p-4 rounded-md mb-4">
            <p className="font-semibold text-blue-600">Condition: Like New</p>
            <p className="text-gray-600">
              Lightly used and fully functional, but does not include the original packaging or
              tags.
            </p>
          </div>

          <div className="flex gap-4 mb-6">
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
              Start the chat
            </button>
            <ShareButton postId={post.id} name={post.name} />
            <FavoriteToggleButton postId={post.id} />
          </div>

          <p className="text-sm text-gray-500">Trade by: John Doe</p>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Meeting Spot</h2>
        <div className="h-72 rounded-lg overflow-hidden">
          <MapLandmark location={{ lat: post.lat ?? 0, lng: post.lng ?? 0 }} />
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Comments</h2>
        <p className="text-gray-500">No comments yet. Be the first to comment!</p>
      </div>
    </section>
  );
};

export default PostDetail;
