import { fetchPostDetail } from "./actions";
import FavoriteToggleButton from "@/components/posts/FavoriteToggleButton";
import Breadcrums from "@/components/posts/Breadcrums";
import ShareButton from "@/components/posts/ShareButton";
import MapLandmark from "@/components/map/Map";
import { redirect } from "next/navigation";
import Image from "next/image";

const PostDetail = async ({ params }: { params: { id: string } }) => {
    const post = await fetchPostDetail({ id: params.id });
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
                                src={post.profile.profileImage || "/default-image.jpg"}
                                alt={post.name}
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                        <FavoriteToggleButton postId={post.id} />
                        <ShareButton postId={post.id} name={""} />
                    </div>
                </div>
                {/* Map Section */}
                <div>
                    {post.lat !== null && post.lng !== null && (
                        <MapLandmark location={{ lat: post.lat, lng: post.lng }} />
                    )}
                </div>
            </div>
        </section>
    );
};

export default PostDetail;
