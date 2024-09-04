import multer from 'multer';
import path from 'path';
import { NextResponse } from 'next/server';

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },  // Limit file size to 5MB
}).array('images', 5);

export async function POST(req) {
  return new Promise((resolve, reject) => {
    upload(req, {}, (err) => {
      if (err) {
        return resolve(new NextResponse(JSON.stringify({ error: err.message }), { status: 400 }));
      }
      const files = req.files.map(file => `/uploads/${file.filename}`);
      resolve(new NextResponse(JSON.stringify({ files }), { status: 200 }));
    });
  });
}