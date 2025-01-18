import { getPostById } from "./actions";

export default async function PostDetail({ params }: { params: { id: string } }) {
  const post = await getPostById(params.id);

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div>
      <h1>{post.name}</h1>
      <p>{post.description}</p>
      <p>Price: ${post.price}</p>
    </div>
  );
}
