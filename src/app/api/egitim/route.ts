import { NextResponse } from "next/server";

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

    return NextResponse.json(courses);
  } catch (error) {
    console.error('❌ API Hatası:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
} 