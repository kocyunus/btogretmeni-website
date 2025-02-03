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
      title: 'Test Blog Yazısı',
      description: 'Bu bir test blog yazısıdır.',
      content: '# Test İçeriği\n\nBu bir test blog yazısının içeriğidir.',
      excerpt: 'Test blog yazısı özeti',
      readingTime: 5,
      tags: ['test', 'örnek'],
      isDraft: true,
      publishedAt: new Date().toISOString(),
      author: {
        name: 'Test Yazar',
        image: '/images/test-avatar.jpg'
      }
    });

    Logger.info('Test blog yazısı oluşturuldu', { slug: testPost.slug });
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