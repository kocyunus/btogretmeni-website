import { NextResponse } from 'next/server';
import { updateAllBlogSlugs } from '@/lib/blog';
import { Logger } from '@/lib/logger';

export async function POST() {
  try {
    const result = await updateAllBlogSlugs();
    Logger.info('Slug güncelleme işlemi tamamlandı:', result);
    return NextResponse.json(result);
  } catch (error) {
    Logger.error('Slug güncelleme işlemi başarısız:', error);
    return NextResponse.json(
      { success: false, message: 'Slug güncelleme işlemi başarısız oldu' },
      { status: 500 }
    );
  }
} 