import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
  title: String,
  description: String,
  owner: String,
  type: String,
  condition: String,
  images: [String],
  likes: [String],
});

const Post = mongoose.models.Post || mongoose.model('Post', PostSchema);
export default Post;