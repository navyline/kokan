import dbConnect from '@/utils/dbConnect';
import Message from '@/models/Message';

export const GET = async (req, res) => {
  await dbConnect();
  try {
    const messages = await Message.find({});
    return new Response(JSON.stringify(messages), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false }), { status: 400 });
  }
};

export const POST = async (req, res) => {
  await dbConnect();
  try {
    const message = await Message.create(await req.json());
    return new Response(JSON.stringify(message), { status: 201 });
  } catch (error) {
    return new Response(JSON.stringify({ success: false }), { status: 400 });
  }
};
