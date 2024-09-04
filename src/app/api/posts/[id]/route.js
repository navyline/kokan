import connectMongoDB from '../../../../../lib/mongodb';
import Post from '../../../../../models/Post';
import { NextResponse } from 'next/server';

export async function GET(req, { params }) {
  await connectMongoDB();
  const { id } = params;
  const post = await Post.findById(id);
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function PUT(req, { params }) {
  await connectMongoDB();
  const { id } = params;
  const { title, description, type, condition, images } = await req.json();
  const post = await Post.findByIdAndUpdate(id, { title, description, type, condition, images }, { new: true });
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  return NextResponse.json(post);
}

export async function DELETE(req, { params }) {
  await connectMongoDB();
  const { id } = params;
  const post = await Post.findByIdAndDelete(id);
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Post deleted successfully' });
}