import mongoose from 'mongoose';

const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String,
    required: true
  },
  readingTime: {
    type: Number,
    required: true,
    default: 5
  },
  coverImage: {
    type: String
  },
  tags: {
    type: [String],
    default: []
  },
  isDraft: {
    type: Boolean,
    default: true
  },
  publishedAt: {
    type: Date,
    required: true
  },
  updatedAt: {
    type: Date
  },
  author: {
    name: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    avatarUrl: {
      type: String,
      required: true
    }
  },
  sources: [{
    title: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    description: String
  }],
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: String,
    canonicalUrl: String
  }
}, {
  timestamps: true // Bu otomatik olarak createdAt ve updatedAt alanlarını ekler
});

// Mongoose modelini oluştur veya var olanı kullan
const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

export default BlogPost; 