import { MetadataRoute } from 'next';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();
  const posts = await BlogPost.find({}).sort({ publishedAt: -1 });

  const blogPosts = posts.map((post) => ({
    url: `https://btogretmeni.com/blog/${post.id}`,
    lastModified: post.updatedAt || post.publishedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: 'https://btogretmeni.com',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://btogretmeni.com/blog',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    ...blogPosts,
  ];
} 