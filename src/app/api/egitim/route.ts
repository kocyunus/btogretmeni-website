import { NextResponse } from "next/server";
import { headers } from 'next/headers';

export async function GET() {
  try {
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
            "Görsel programlama"
          ],
          topics: [
            "Algoritma",
            "Kodlama",
            "Oyun"
          ]
        }
      ]
    };

    return new NextResponse(JSON.stringify(courses), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error) {
    console.error('❌ API Hatası:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }), 
      { status: 500 }
    );
  }
} 