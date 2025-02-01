import mongoose, { Schema } from 'mongoose';

const blogPostSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
  },
  readingTime: {
    type: Number,
    required: true,
    default: 5,
  },
  publishedAt: {
    type: String,
    required: true,
  },
  updatedAt: {
    type: String,
  },
  isDraft: {
    type: Boolean,
    default: true,
  },
  tags: {
    type: [String],
    default: [],
  },
  author: {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
  },
}, {
  timestamps: true,
});

// Eğer model zaten varsa onu kullan, yoksa yeni model oluştur
const BlogPostModel = mongoose.models.BlogPost || mongoose.model('BlogPost', blogPostSchema);

export default BlogPostModel; 