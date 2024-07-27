// src/app/api/products/route.js

import dbConnect from '@/utils/dbConnect';
import Product from '@/models/Product';

export async function GET(req, res) {
  await dbConnect();
  const { user } = req.query;
  let filter = {};
  if (user) {
    filter = { user };
  }
  try {
    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function POST(req, res) {
  await dbConnect();
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    console.error(error);
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function PUT(req, res) {
  await dbConnect();
  const { id, name, description, image } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(
      id,
      { name, description, image },
      { new: true }
    );
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}

export async function DELETE(req, res) {
  await dbConnect();
  const { id } = req.query;
  try {
    await Product.findByIdAndDelete(id);
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
}
