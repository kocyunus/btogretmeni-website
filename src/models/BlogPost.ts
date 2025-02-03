import mongoose, { Model } from 'mongoose';
import slugify from 'slugify';

export interface BlogPostDocument extends mongoose.Document {
  title: string;
  slug: string;
  description: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  readingTime: number;
  publishedAt: string;
  updatedAt?: string;
  isDraft: boolean;
  tags: string[];
  author: {
    name: string;
    image?: string;
  };
  sources?: Array<{
    title: string;
    url: string;
    description?: string;
  }>;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    canonicalUrl?: string;
  };
}

interface BlogPostModel extends Model<BlogPostDocument> {
  updateSlugs(): Promise<void>;
}

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
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
  sources: [{
    title: String,
    url: String,
    description: String,
  }],
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: String,
    canonicalUrl: String,
  },
}, {
  timestamps: true,
});

// Slug oluşturma middleware'i
blogPostSchema.pre('save', function(next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
      locale: 'tr'
    });
  }
  next();
});

// Mevcut blog yazıları için slug güncelleme fonksiyonu
blogPostSchema.statics.updateSlugs = async function() {
  const posts = await this.find({ slug: { $exists: false } });
  
  for (const post of posts) {
    post.slug = slugify(post.title, {
      lower: true,
      strict: true,
      locale: 'tr'
    });
    await post.save();
  }
};

// Eğer model zaten varsa onu kullan, yoksa yeni model oluştur
const BlogPostModel = (mongoose.models.BlogPost || mongoose.model<BlogPostDocument, BlogPostModel>('BlogPost', blogPostSchema)) as BlogPostModel;

export default BlogPostModel; 