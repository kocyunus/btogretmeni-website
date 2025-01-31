'use server';

import { connectToDatabase } from '@/lib/mongodb';
import BlogPostModel from '@/models/BlogPost';
import type { Document } from 'mongoose';

// BlogPost interface'ini @/types/blog'dan import ediyoruz
import type { BlogPost } from '@/types/blog';

// BlogPost tipini tanımlıyoruz
export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  excerpt: string;
  readingTime: number;
  tags: string[];
  isDraft: boolean;
  publishedAt: Date;
  updatedAt?: Date;
  author: {
    name: string;
    title: string;
    avatarUrl: string;
  };
  sources: Array<{
    title: string;
    url: string;
    description?: string;
  }>;
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

// Model kontrolü
function getModel() {
  if (!BlogPostModel) {
    throw new Error('BlogPost modeli sadece server tarafında kullanılabilir.');
  }
  return BlogPostModel;
}

// MongoDB dökümanını BlogPost tipine dönüştür
function formatPost(doc: Document): BlogPost {
  const post = doc.toObject();
  return {
    id: post._id.toString(),
    title: post.title,
    description: post.description,
    content: post.content,
    excerpt: post.excerpt,
    readingTime: post.readingTime,
    tags: post.tags || [],
    isDraft: post.isDraft || false,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt ? new Date(post.updatedAt) : undefined,
    author: post.author,
    sources: post.sources || [],
    seo: post.seo || {}
  };
}

// Blog yazılarını getir
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    await connectToDatabase();
    const BlogPost = getModel();
    const posts = await BlogPost.find({ isDraft: false }).sort({ publishedAt: -1 });
    return posts.map(post => formatPost(post));
  } catch (error) {
    console.error('Blog yazıları getirilirken hata:', error);
    throw error;
  }
}

// Blog yazısını getir
export async function getBlogPost(id: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`/api/blog/${id}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return {
      ...data,
      _id: id,
      publishedAt: new Date(data.publishedAt || new Date())
    } as BlogPost;
  } catch (error) {
    console.error('Blog yazısı getirilirken hata:', error);
    return null;
  }
}

// Blog yazısı oluştur
export async function createBlogPost(post: Partial<BlogPost>): Promise<BlogPost> {
  try {
    await connectToDatabase();
    const BlogPost = getModel();
    const newPost = await BlogPost.create({
      ...post,
      publishedAt: new Date(),
      isDraft: post.isDraft ?? true
    });
    return formatPost(newPost);
  } catch (error) {
    console.error('Blog yazısı oluşturulurken hata:', error);
    throw error;
  }
}

// Blog yazısını güncelle
export async function updateBlogPost(id: string, post: Partial<BlogPost>): Promise<BlogPost | null> {
  try {
    await connectToDatabase();
    const BlogPost = getModel();
    const updatedPost = await BlogPost.findByIdAndUpdate(
      id,
      { ...post, updatedAt: new Date() },
      { new: true }
    );
    return updatedPost ? formatPost(updatedPost) : null;
  } catch (error) {
    console.error('Blog yazısı güncellenirken hata:', error);
    throw error;
  }
}

// Blog yazısını sil
export async function deleteBlogPost(id: string): Promise<boolean> {
  try {
    await connectToDatabase();
    const BlogPost = getModel();
    const result = await BlogPost.findByIdAndDelete(id);
    return !!result;
  } catch (error) {
    console.error('Blog yazısı silinirken hata:', error);
    throw error;
  }
} 