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
    _id: post._id.toString(),
    title: post.title,
    description: post.description,
    content: post.content,
    excerpt: post.excerpt,
    readingTime: post.readingTime,
    coverImage: post.coverImage,
    tags: post.tags,
    isDraft: post.isDraft,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    author: post.author,
    sources: post.sources,
    seo: post.seo,
    slug: post.slug
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
      posts: posts.map(post => ({
        ...post,
        _id: String(post._id),
        slug: post.slug || '',
        title: post.title || '',
        description: post.description || '',
        content: post.content || '',
        excerpt: post.excerpt || '',
        readingTime: post.readingTime || 0,
        tags: post.tags || [],
        isDraft: post.isDraft || false,
        publishedAt: post.publishedAt || new Date().toISOString(),
        author: {
          name: post.author?.name || '',
          image: post.author?.image || ''
        }
      }))
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
      publishedAt: new Date().toISOString(),
      isDraft: data.isDraft ?? true,
      author: {
        name: data.author?.name || DEFAULT_AUTHOR.name,
        image: data.author?.image || DEFAULT_AUTHOR.avatarUrl
      }
    });

    await post.save();
    Logger.info('Yeni blog yazısı oluşturuldu');

    return NextResponse.json({ 
      success: true, 
      post: {
        ...post.toObject(),
        _id: String(post._id),
        slug: post.slug || '',
        publishedAt: post.publishedAt || new Date().toISOString()
      }
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
    const slug = url.pathname.split('/').pop();

    if (!slug || slug === 'blog') {
      return new Response('Geçersiz blog yazısı slug', { status: 400 });
    }

    const deletedPost = await getModel().findOneAndDelete({ slug });
    if (!deletedPost) {
      return new Response('Blog yazısı bulunamadı', { status: 404 });
    }

    Logger.info(`Blog yazısı silindi: ${deletedPost.title}`);
    return new Response(JSON.stringify(deletedPost), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    Logger.error('Blog yazısı silinirken hata:', error);
    return new Response('Blog yazısı silinemedi', { status: 500 });
  }
} 