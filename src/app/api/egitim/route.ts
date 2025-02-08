import { NextResponse } from "next/server";
import { headers } from 'next/headers';

export async function GET() {
  try {
    // Request headers'ı kontrol et
    const headersList = headers();
    const host = headersList.get('host') || '';
    const origin = headersList.get('origin') || '';

    console.log('🔒 API Güvenlik Kontrolü:', {
      host,
      origin,
      headers: Object.fromEntries(headersList.entries())
    });

    // Güvenlik kontrolleri - production için devre dışı bırakıldı
    // if (!host.includes('localhost') && !host.includes('vercel.app') && !host.includes('kocyunus.com')) {
    //   return new NextResponse(
    //     JSON.stringify({ error: 'Unauthorized' }), 
    //     { status: 401 }
    //   );
    // }

    const courses = {
      courses: [
        {
          _id: "1",
          slug: "zindandan-kacis",
          title: "Zindandan Kaçış",
          description: "Kodlama mantığını eğlenceli bir macera oyunu ile öğrenin! Karakterinizi zindandan kurtarmak için algoritma ve programlama becerilerinizi kullanın.",
          imageUrl: "/images/courses/zindandan-kacis.svg",
          level: "beginner",
          duration: 2,
          features: [
            "Temel programlama kavramları",
            "Algoritma mantığı",
            "Problem çözme becerileri",
            "Görsel programlama",
            "Eğlenceli öğrenme deneyimi",
            "Anlık geri bildirim"
          ],
          topics: [
            "Algoritma",
            "Kodlama",
            "Mantık",
            "Oyun"
          ]
        }
      ]
    };

    console.log('✅ API Yanıt Hazırlanıyor:', {
      coursesCount: courses.courses.length,
      responseHeaders: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      }
    });

    return new NextResponse(JSON.stringify(courses), {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('❌ API Hatası:', {
      error,
      message: error instanceof Error ? error.message : 'Bilinmeyen hata',
      stack: error instanceof Error ? error.stack : undefined
    });
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }), 
      { status: 500 }
    );
  }
} 