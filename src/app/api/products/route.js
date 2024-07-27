import dbConnect from '@/utils/dbConnect';
import Product from '@/models/Product';

export const GET = async (req, res) => {
  await dbConnect();
  try {
    const products = await Product.find({});
    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false }), { status: 400 });
  }
};

export const POST = async (req, res) => {
  await dbConnect();
  try {
    const product = await Product.create(await req.json());
    return new Response(JSON.stringify(product), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false }), { status: 400 });
  }
};
