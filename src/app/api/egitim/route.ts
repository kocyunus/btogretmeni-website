import { NextResponse } from "next/server";

export async function GET() {
  const courses = {
    courses: [
      {
        _id: "1",
        slug: "zindandan-kacis",
        title: "Zindandan Kaçış",
        description: "Kodlama mantığını eğlenceli bir macera oyunu ile öğrenin! Karakterinizi zindandan kurtarmak için algoritma ve programlama becerilerinizi kullanın.",
        imageUrl: "/images/courses/zindandan-kacis.png",
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

  return new NextResponse(JSON.stringify(courses), {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  });
} 