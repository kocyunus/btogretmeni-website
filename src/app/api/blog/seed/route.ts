import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import BlogPostModel from '@/models/BlogPost';
import { Logger } from '@/lib/logger';

const samplePosts = [
  {
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
  }
];

export async function GET() {
  try {
    Logger.api('GET', '/api/blog/seed');
    
    await connectToDatabase();
    Logger.db('connect', 'mongodb');

    let addedCount = 0;
    
    // Örnek yazıları ekle
    for (const samplePost of samplePosts) {
      // Aynı başlıkla yazı var mı kontrol et
      const existingPost = await BlogPostModel.findOne({ title: samplePost.title });
      
      if (!existingPost) {
        const post = await BlogPostModel.create(samplePost);
        addedCount++;
        Logger.info(`Örnek blog yazısı eklendi: ${post.title}`);
      }
    }

    Logger.info(`${addedCount} adet örnek blog yazısı oluşturuldu`);
    return NextResponse.json({ 
      message: `${addedCount} adet örnek blog yazısı oluşturuldu`,
      success: true
    });

  } catch (error) {
    Logger.error('Örnek blog yazıları oluşturulurken hata', error);
    return NextResponse.json(
      { error: 'Örnek blog yazıları oluşturulamadı' },
      { status: 500 }
    );
  }
} 