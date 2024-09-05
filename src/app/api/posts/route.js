import connectMongoDB from '../../../../lib/mongodb';
import Post from '../../../../models/Post';
import { NextResponse } from 'next/server';



export async function POST(req) {
  await connectMongoDB();
  const { title, description, owner, ownerName, category, condition, images } = await req.json();
  const newPost = new Post({ title, description, owner, ownerName, category, condition, images });
  await newPost.save();
  return NextResponse.json(newPost);
}

export async function GET() {
  await connectMongoDB();
  const posts = await Post.find({});
  return NextResponse.json(posts);
}