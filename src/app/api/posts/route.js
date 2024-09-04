import connectMongoDB from '../../../../lib/mongodb';
import Post from '../../../../models/Post';
import { NextResponse } from 'next/server';

export async function GET() {
  await connectMongoDB();
  const posts = await Post.find({});
  return NextResponse.json(posts);
}

export async function POST(req) {
  await connectMongoDB();
  const { title, description, owner, type, condition, images } = await req.json();
  const newPost = new Post({ title, description, owner, type, condition, images });
  await newPost.save();
  return NextResponse.json(newPost);
}