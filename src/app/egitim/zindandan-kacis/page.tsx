import { Metadata } from "next";
import { connectToDatabase } from "@/lib/mongodb";
import Course from "@/models/Course";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Zindandan Kaçış | BT Öğretmeni",
  description: "Kodlama mantığını eğlenceli bir macera oyunu ile öğrenin!",
};

// Statik sayfa olarak işaretle
export const dynamic = 'force-static';

async function getCourse() {
  try {
    await connectToDatabase();
    const course = await Course.findOne({ slug: 'zindandan-kacis' });
    return course;
  } catch (error) {
    console.error("Kurs verileri getirilirken hata:", error);
    return null;
  }
}

export default async function ZindandanKacisPage() {
  const course = await getCourse();

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          Kurs bulunamadı.
        </div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Bölümü */}
        <section className="mb-12">
          <div className="relative aspect-video w-full rounded-xl overflow-hidden mb-8">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
            {course.imageUrl ? (
              <Image
                src={course.imageUrl}
                alt={course.title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary/40">Görsel Yok</span>
              </div>
            )}
          </div>

          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-4xl font-bold">{course.title}</h1>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              course.level === "beginner" 
                ? "bg-green-100 text-green-800"
                : course.level === "intermediate"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}>
              {course.level === "beginner" 
                ? "Başlangıç" 
                : course.level === "intermediate"
                ? "Orta Seviye"
                : "İleri Seviye"}
            </span>
          </div>

          <p className="text-lg text-muted-foreground mb-8">
            {course.description}
          </p>

          {/* Özellikler */}
          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {course.features?.map((feature: string, index: number) => (
              <div 
                key={index}
                className="flex items-center p-4 rounded-lg bg-card"
              >
                <svg
                  className="w-5 h-5 mr-3 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* Oyun Başlat Butonu */}
          <button 
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-lg font-medium text-lg transition-colors"
            onClick={() => {
              window.location.href = "/game";
            }}
          >
            Oyunu Başlat
          </button>
        </section>

        {/* Konular */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Konular</h2>
          <div className="flex flex-wrap gap-2">
            {course.topics.map((topic: string, index: number) => (
              <span
                key={index}
                className="bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm"
              >
                {topic}
              </span>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
} 