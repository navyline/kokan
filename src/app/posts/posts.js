import { connectToDatabase } from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { title, description, condition, category, images, owner } = req.body;

    if (!title || !description || !condition || !category || !owner) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const { db } = await connectToDatabase();
      const collection = db.collection('posts');

      const newPost = {
        title,
        description,
        condition,
        category,
        images,
        owner,
        createdAt: new Date(),
      };

      const result = await collection.insertOne(newPost);

      return res.status(201).json(result.ops[0]);
    } catch (error) {
      console.error('Failed to create post:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}