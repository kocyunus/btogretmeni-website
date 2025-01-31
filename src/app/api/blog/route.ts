import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { handleError } from '@/lib/error';
import { Document } from 'mongoose';
import BlogPostModel from '@/models/BlogPost';
import type { BlogPost, SEO } from '@/types/blog';
import { createBlogPost, getBlogPosts } from '@/lib/blog';

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
    coverImage: post.coverImage || DEFAULT_COVER_IMAGE,
    tags: post.tags || [],
    isDraft: post.isDraft || false,
    publishedAt: new Date(post.publishedAt),
    updatedAt: post.updatedAt ? new Date(post.updatedAt) : undefined,
    author: post.author || DEFAULT_AUTHOR,
    sources: post.sources || [],
    seo: post.seo
  };
}

// Blog yazılarını getir
export async function GET() {
  try {
    await connectToDatabase();
    const model = getModel();
    const posts = await model.find().sort({ publishedAt: -1 });
    return NextResponse.json(posts.map(formatPost));
  } catch (error) {
    console.error('Blog yazıları alınırken hata:', error);
    return NextResponse.json(
      { error: 'Blog yazıları alınamadı' },
      { status: 500 }
    );
  }
}

// Yeni blog yazısı oluştur
export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const model = getModel();
    const data = await request.json();
    
    // Zorunlu alanları kontrol et
    const requiredFields = ['title', 'description', 'content', 'excerpt'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Eksik alanlar: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    const newPost = await model.create({
      ...data,
      publishedAt: new Date(),
      updatedAt: new Date(),
      author: data.author || DEFAULT_AUTHOR,
      tags: data.tags || [],
      isDraft: data.isDraft ?? true
    });

    return NextResponse.json(formatPost(newPost));
  } catch (error) {
    console.error('Blog yazısı oluşturulurken hata:', error);
    const message = error instanceof Error ? error.message : 'Blog yazısı oluşturulamadı';
    return NextResponse.json({ error: message }, { status: 400 });
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