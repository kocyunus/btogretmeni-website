import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BlogPostModel from '@/models/BlogPost';
import { Logger } from '@/lib/logger';

export async function GET() {
  try {
    Logger.api('GET', '/api/blog/test');
    
    await connectToDatabase();
    Logger.db('connect', 'mongodb');

    // Önce test verisi var mı kontrol et
    const existingPost = await BlogPostModel.findOne({ 
      title: 'Next.js ile Blog Oluşturma'
    });

    if (existingPost) {
      Logger.info('Test blog yazısı zaten mevcut');
      return NextResponse.json({ message: 'Test blog yazısı zaten mevcut' });
    }

    // Test verisi oluştur
    const testPost = await BlogPostModel.create({
      title: 'Next.js ile Blog Oluşturma',
      description: 'Next.js kullanarak modern ve performanslı bir blog nasıl oluşturulur?',
      content: `
# Next.js ile Blog Oluşturma

Next.js, React tabanlı web uygulamaları geliştirmek için mükemmel bir framework'tür. Bu yazıda, Next.js kullanarak nasıl modern ve performanslı bir blog oluşturabileceğinizi öğreneceksiniz.

## Özellikler

- Server-side rendering
- Static site generation
- API routes
- TypeScript desteği
- Tailwind CSS entegrasyonu

## Başlangıç

İlk olarak, yeni bir Next.js projesi oluşturalım:

\`\`\`bash
npx create-next-app@latest my-blog --typescript --tailwind
\`\`\`
      `,
      excerpt: 'Next.js ile modern bir blog nasıl oluşturulur? Server-side rendering, static site generation ve daha fazlası...',
      readingTime: 5,
      tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
      isDraft: false,
      publishedAt: new Date(),
      author: {
        name: 'Yunus Koç',
        title: 'BT Öğretmeni',
        avatarUrl: '/images/avatar.jpg'
      }
    });

    Logger.info('Test blog yazısı oluşturuldu', { id: testPost._id });
    return NextResponse.json({ 
      message: 'Test blog yazısı oluşturuldu',
      post: testPost
    });

  } catch (error) {
    Logger.error('Test blog yazısı oluşturulurken hata', error);
    return NextResponse.json(
      { error: 'Test blog yazısı oluşturulamadı' },
      { status: 500 }
    );
  }
} 