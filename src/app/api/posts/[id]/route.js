import { connectMongoDB } from '../../../../../lib/mongodb';
import Post from '../../../../../models/Post';
import { NextResponse } from 'next/server';

// GET: ดึงข้อมูลโพสต์ตาม id
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
    return NextResponse.json({ error: 'Error fetching post', details: error.message }, { status: 500 });
  }
}

// PUT: แก้ไขโพสต์ตาม id
export async function PUT(req, { params }) {
  await connectMongoDB();
  const { id } = params;
  const { title, description, type, condition, images } = await req.json();
  
  // ตรวจสอบข้อมูลที่จำเป็น
  if (!title || !description || !type || !condition || !Array.isArray(images)) {
    return NextResponse.json({ error: 'Missing required fields or invalid image array' }, { status: 400 });
  }

  try {
    const post = await Post.findByIdAndUpdate(id, { title, description, type, condition, images }, { new: true });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating post', details: error.message }, { status: 500 });
  }
}

// DELETE: ลบโพสต์ตาม id
export async function DELETE(req, { params }) {
  await connectMongoDB();
  const { id } = params;
  
  try {
    const post = await Post.findByIdAndDelete(id);
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting post', details: error.message }, { status: 500 });
  }
}
