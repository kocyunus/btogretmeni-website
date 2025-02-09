import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Course from "@/models/Course";

export async function GET() {
  try {
    await connectToDatabase();

    // Mevcut kursu kontrol et
    const existingCourse = await Course.findOne({ slug: 'zindandan-kacis' });
    if (existingCourse) {
      return NextResponse.json({ message: 'Kurs zaten mevcut' });
    }

    // Yeni kurs oluştur
    const course = await Course.create({
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
    });

    return NextResponse.json({ message: 'Kurs başarıyla oluşturuldu', course });
  } catch (error) {
    console.error('Seed hatası:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 