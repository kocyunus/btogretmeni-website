import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogPost from '@/models/BlogPost';

// Varsayılan sayfalama değerleri
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

// MongoDB filtre tipi
interface MongoDBFilter {
  $text?: { $search: string };
  tags?: string;
  publishedAt?: {
    $gte?: string;
    $lte?: string;
  };
}

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Arama parametreleri
    const query = searchParams.get('q');
    const tag = searchParams.get('tag');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(
      parseInt(searchParams.get('limit') || String(DEFAULT_PAGE_SIZE)),
      MAX_PAGE_SIZE
    );

    await connectDB();

    // MongoDB sorgusu oluştur
    const filter: MongoDBFilter = {};

    // Metin araması
    if (query) {
      filter.$text = { $search: query };
    }

    // Etiket filtresi
    if (tag) {
      filter.tags = tag;
    }

    // Tarih aralığı filtresi
    if (startDate || endDate) {
      filter.publishedAt = {};
      if (startDate) {
        filter.publishedAt.$gte = new Date(startDate).toISOString();
      }
      if (endDate) {
        filter.publishedAt.$lte = new Date(endDate).toISOString();
      }
    }

    // Toplam sonuç sayısı
    const total = await BlogPost.countDocuments(filter);

    // Sonuçları getir
    const posts = await BlogPost.find(filter)
      .select('id title description readingTime coverImage tags publishedAt author')
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Etiket önerileri
    const tagSuggestions = query
      ? await BlogPost.distinct('tags', {
          tags: { $regex: query, $options: 'i' },
        })
      : [];

    // Yanıtı oluştur
    const response = NextResponse.json({
      posts,
      pagination: {
        total,
        page,
        pageSize: limit,
        pageCount: Math.ceil(total / limit),
      },
      suggestions: {
        tags: tagSuggestions,
      },
    });

    // Cache başlıkları
    const CACHE_MAX_AGE = 60; // 1 dakika
    response.headers.set('Cache-Control', `public, s-maxage=${CACHE_MAX_AGE}`);
    response.headers.set('CDN-Cache-Control', `public, s-maxage=${CACHE_MAX_AGE}`);

    return response;
  } catch (error) {
    console.error('Blog arama hatası:', error);
    return NextResponse.json(
      { error: 'Blog yazıları aranırken bir hata oluştu.' },
      { status: 500 }
    );
  }
} 