import { BlogPost } from '@/types/blog';

// API Routes'da kullanılacak blog yazıları
export const blogPosts: BlogPost[] = [
  {
    _id: "1",
    title: "Scratch ile Çocuklar için Kodlama",
    description: "Scratch kullanarak çocuklara kodlama öğretmenin yolları ve faydaları",
    content: "Scratch, MIT Media Lab tarafından geliştirilen ve çocukların programlama öğrenmesini kolaylaştıran blok tabanlı bir kodlama platformudur...",
    excerpt: "Scratch ile kodlama öğrenmek çocuklar için eğlenceli ve öğretici bir deneyim sunuyor.",
    readingTime: 5,
    coverImage: "/blog/scratch-coding.jpg",
    tags: ["Eğitim", "Kodlama", "Scratch", "Çocuk Gelişimi"],
    publishedAt: new Date("2024-01-25").toISOString(),
    author: {
      name: "Yunus Koç",
      image: "/images/avatar.jpg"
    },
    isDraft: false
  },
  {
    _id: "2",
    title: "Python ile Veri Analizi",
    description: "Python programlama dili kullanarak veri analizi yapmanın temelleri",
    content: "Python, veri analizi için en popüler programlama dillerinden biridir...",
    excerpt: "Python ile veri analizi yaparak verilerinizi anlamlandırın.",
    readingTime: 8,
    coverImage: "/blog/python-data-analysis.jpg",
    tags: ["Python", "Veri Analizi", "Programlama"],
    publishedAt: new Date("2024-01-26").toISOString(),
    author: {
      name: "Yunus Koç",
      image: "/images/avatar.jpg"
    },
    isDraft: false
  }
];

export default blogPosts; 