import { NextResponse } from 'next/server';
import { connectMongoDB } from '../../../../../lib/mongodb';
import Post from '../../../../../models/Post';
import jwt from 'jsonwebtoken';

const checkAuth = (req) => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;

  const token = authHeader.split(' ')[1];
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.AUTH0_CLIENT_SECRET);
    return decoded;
  } catch (error) {
    console.error('JWT verification failed:', error);
    return null;
  }
};

export async function GET(req, { params }) {
  await connectMongoDB();
  const { id } = params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return NextResponse.json({ error: 'Error fetching post', details: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await connectMongoDB();
  const { id } = params;
  const { title, description, type, condition, images } = await req.json();

  if (!title || !description || !type || !condition || !Array.isArray(images)) {
    return NextResponse.json({ error: 'Missing required fields or invalid image array' }, { status: 400 });
  }

  const user = checkAuth(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.userId.toString() !== user.sub && user.role !== 'admin') {
      return NextResponse.json({ error: 'You are not authorized to edit this post' }, { status: 403 });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, description, type, condition, images },
      { new: true }
    );
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('Error updating post:', error);
    return NextResponse.json({ error: 'Error updating post', details: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connectMongoDB();
  const { id } = params;

  const user = checkAuth(req);
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    if (post.userId.toString() !== user.sub && user.role !== 'admin') {
      return NextResponse.json({ error: 'You are not authorized to delete this post' }, { status: 403 });
    }

    await Post.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ error: 'Error deleting post', details: error.message }, { status: 500 });
  }
}
