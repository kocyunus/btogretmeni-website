import { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import LoadingSpinner from "@/components/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

export const metadata: Metadata = {
  title: "Eğitim | BT Öğretmeni",
  description: "BT Öğretmeni eğitim içerikleri, kurslar ve öğrenme kaynakları.",
};

async function getEducationContent() {
  try {
    console.log('🔍 Eğitim içerikleri getiriliyor...');
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
    const response = await fetch(`${baseUrl}/api/egitim`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      console.error('❌ API yanıt hatası:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Eğitim içerikleri başarıyla alındı:', data);
    return data;
  } catch (error) {
    console.error("❌ Eğitim içerikleri yüklenirken hata:", error);
    throw error;
  }
}

export default async function EgitimPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Hero Bölümü */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Eğitim İçerikleri
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Yazılım, robotik ve teknoloji eğitimleri ile kendinizi geliştirin.
          </p>
        </section>

        {/* İçerik Bölümü */}
        <Suspense fallback={<LoadingSpinner />}>
          <EducationContent />
        </Suspense>
      </div>
    </main>
  );
}

async function EducationContent() {
  try {
    const educationData = await getEducationContent();

    if (!educationData?.courses?.length) {
      return (
        <div className="text-center p-8">
          <p className="text-amber-400">Henüz eğitim içeriği bulunmamaktadır.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-6">
        {educationData.courses.map((course: any, index: number) => (
          <Link
            href={`/egitim/${course.slug}`}
            key={course._id}
            className="block group"
          >
            <div className="bg-card hover:bg-card/90 rounded-xl p-6 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Oyun Görseli */}
                <div className="w-full md:w-1/3 relative aspect-video rounded-lg overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                  {course.imageUrl ? (
                    <Image
                      src={course.imageUrl}
                      alt={course.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw"
                      className="object-cover"
                      priority={index === 0}
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                      <span className="text-primary/40">Görsel Yok</span>
                    </div>
                  )}
                </div>

                {/* İçerik */}
                <div className="flex-1">
                  {/* Başlık ve Seviye */}
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-2xl font-bold">{course.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
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

                  {/* Açıklama */}
                  <p className="text-muted-foreground mb-4">
                    {course.description}
                  </p>

                  {/* Özellikler */}
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {course.features?.map((feature: string, index: number) => (
                      <div 
                        key={index}
                        className="flex items-center text-sm text-muted-foreground"
                      >
                        <svg
                          className="w-4 h-4 mr-2 text-primary"
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
                        {feature}
                      </div>
                    ))}
                  </div>

                  {/* Alt Bilgiler */}
                  <div className="flex flex-wrap items-center gap-4">
                    {/* Süre */}
                    <div className="flex items-center text-sm text-muted-foreground">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {course.duration} saat
                    </div>

                    {/* Konular */}
                    <div className="flex flex-wrap gap-2">
                      {course.topics.map((topic: string, index: number) => (
                        <span
                          key={index}
                          className="bg-primary/10 text-primary px-2 py-1 rounded-md text-sm"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    );
  } catch (error) {
    return (
      <div className="rounded-lg bg-red-500/10 p-4 text-red-500">
        <p>Eğitim içerikleri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.</p>
        <p className="text-sm mt-2 text-red-400">{error instanceof Error ? error.message : 'Bilinmeyen hata'}</p>
      </div>
    );
  }
} 