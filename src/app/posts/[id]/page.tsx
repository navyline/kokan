import { fetchPostDetail } from "./actions";
import FavoriteToggleButton from "@/components/posts/FavoriteToggleButton";
import Breadcrums from "@/components/posts/Breadcrums";
import ShareButton from "@/components/posts/ShareButton";
import MapLandmark from "@/components/map/Map";
import { redirect } from "next/navigation";
import Image from "next/image";

interface PostDetailProps {
  params: Promise<{
    id: string;
  }>;
}

const PostDetail = async ({ params }: PostDetailProps) => {
  const resolvedParams = await params;
  const { id } = resolvedParams;

  const post = await fetchPostDetail({ id });
  if (!post) {
    redirect("/");
    return null;
  }

  return (
    <section className="p-4 md:p-8 bg-gray-50 min-h-screen">
      {/* Breadcrumbs */}
      <Breadcrums name={post.name} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Image and Favorite Section */}
        <div className="space-y-4">
          <div className="relative w-full h-64 md:h-80 rounded-lg overflow-hidden">
            <Image
              src={post.image || "/default-image.jpg"}
              alt={post.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex justify-between items-center">
            <FavoriteToggleButton postId={post.id} />
            <ShareButton postId={post.id} name={post.name} />
          </div>
        </div>

        {/* Details Section */}
        <div className="space-y-4">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{post.name}</h1>
          <p className="text-gray-600">{post.description}</p>
          <div className="space-y-1 text-sm md:text-base">
            <p>
              <strong>Category:</strong> {post.categoryId || "N/A"}
            </p>
            <p>
              <strong>Condition:</strong> {post.condition || "N/A"}
            </p>
          </div>
          <button className="w-full bg-yellow-400 text-white py-2 rounded-lg shadow hover:bg-yellow-500 transition">
            Start the chat
          </button>
        </div>
      </div>

      {/* Map Section */}
      {post.lat !== null && post.lng !== null && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Meeting Spot</h2>
          <div className="w-full h-60 md:h-80 rounded-lg overflow-hidden">
            <MapLandmark location={{ lat: post.lat, lng: post.lng }} />
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Comments</h2>
        <textarea
          className="w-full border border-gray-300 rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Write a comment..."
        ></textarea>
      </div>
    </section>
  );
};

export default PostDetail;
