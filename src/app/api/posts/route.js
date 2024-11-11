import { connectMongoDB } from '../../../../lib/mongodb';
import Post from '../../../../models/Post';
import { NextResponse } from 'next/server';

export async function POST(req) {
  await connectMongoDB();
  
  try {
    const { title, description, owner, ownerName, category, condition, imageUrls } = await req.json();

    // ตรวจสอบข้อมูลที่จำเป็น
    if (!title || !description || !owner || !ownerName || !category || !condition) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // ตรวจสอบรูปภาพว่าเป็น array และมีค่า
    if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
      return NextResponse.json({ error: 'Invalid or empty imageUrls' }, { status: 400 });
    }

    const newPost = new Post({ title, description, owner, ownerName, category, condition, imageUrls });
    await newPost.save();
    return NextResponse.json(newPost);
  } catch (error) {
    return NextResponse.json({ error: 'Error creating post', details: error.message }, { status: 500 });
  }
}

export async function GET() {
  await connectMongoDB();

  try {
    const posts = await Post.find({});
    return NextResponse.json(posts);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching posts', details: error.message }, { status: 500 });
  }
}
