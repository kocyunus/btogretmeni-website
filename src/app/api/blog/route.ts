import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { handleError } from '@/lib/error';
import { Document } from 'mongoose';
import BlogPostModel from '@/models/BlogPost';
import type { BlogPost, SEO } from '@/types/blog';
import { createBlogPost, getBlogPosts } from '@/lib/blog';
import Logger from '@/lib/logger';
import mongoose from 'mongoose';

// Varsayılan gradient arka plan URL'si
const DEFAULT_COVER_IMAGE = `https://dummyimage.com/1200x630/4F46E5/ffffff.png&text=${encodeURIComponent('BT Öğretmeni')}`;

// Varsayılan sayfalama değerleri
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

// Varsayılan yazar bilgisi
const DEFAULT_AUTHOR = {
  name: "Yunus Koç",
  title: "BT Öğretmeni",
  avatarUrl: "/images/avatar.jpg"
};

// MongoDB modelini al
function getModel() {
  if (!BlogPostModel) {
    throw new Error('BlogPost modeli bulunamadı');
  }
  return BlogPostModel;
}

// MongoDB belgesini BlogPost tipine dönüştür
function formatPost(doc: Document): BlogPost {
  const post = doc.toObject();
  return {
    id: post._id.toString(),
    title: post.title,
    description: post.description,
    content: post.content,
    excerpt: post.excerpt,
    readingTime: post.readingTime,
    coverImage: post.coverImage || DEFAULT_COVER_IMAGE,
    tags: post.tags || [],
    isDraft: post.isDraft || false,
    publishedAt: new Date(post.publishedAt || new Date()),
    updatedAt: post.updatedAt ? new Date(post.updatedAt) : undefined,
    author: post.author || DEFAULT_AUTHOR,
    sources: post.sources || [],
    seo: post.seo
  };
}

// Blog yazılarını getir
export async function GET() {
  try {
    Logger.api('GET', '/api/blog');
    
    await connectToDatabase();
    Logger.db('connect', 'mongodb');

    const posts = await BlogPostModel.find()
      .sort({ publishedAt: -1 })
      .lean();

    Logger.info(`${posts.length} blog yazısı yüklendi`);

    return NextResponse.json({ 
      success: true,
      posts: posts 
    });

  } catch (error) {
    Logger.error('Blog yazıları getirilirken hata oluştu', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Blog yazıları getirilirken bir hata oluştu' 
      },
      { status: 500 }
    );
  }
}

// Yeni blog yazısı oluştur
export async function POST(request: Request) {
  try {
    Logger.api('POST', '/api/blog');
    
    await connectToDatabase();
    const data = await request.json();

    const post = new BlogPostModel({
      ...data,
      publishedAt: new Date(),
    });

    await post.save();
    Logger.info('Yeni blog yazısı oluşturuldu');

    return NextResponse.json({ 
      success: true, 
      post 
    });

  } catch (error) {
    Logger.error('Blog yazısı oluşturulurken hata oluştu', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Blog yazısı oluşturulurken bir hata oluştu' 
      },
      { status: 500 }
    );
  }
}

// Blog yazısını sil
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (id && id !== 'blog') {
      const deletedPost = await getModel().findByIdAndDelete(id);
      if (!deletedPost) {
        return new Response('Blog yazısı bulunamadı', { status: 404 });
      }
      return new Response(JSON.stringify(deletedPost), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await getModel().deleteMany({});
    return new Response('Tüm blog yazıları silindi', { status: 200 });
  } catch (error) {
    console.error('Blog yazısı silinirken hata:', error);
    return new Response('Blog yazısı silinemedi', { status: 500 });
  }
} 