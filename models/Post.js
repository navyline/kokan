import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  owner: { type: String, required: true },
  ownerName: { type: String, required: true },
  category: { type: String, required: true },
  condition: { type: String, required: true },
  imageUrls: [{ type: String }], // Array สำหรับเก็บ URL ของรูปภาพ
  likes: [{ type: String }], // Array สำหรับเก็บ ID ของผู้ที่กดไลค์
}, { timestamps: true }); // เพิ่ม timestamps เพื่อบันทึกวันที่สร้างและแก้ไข

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
export default Post;
