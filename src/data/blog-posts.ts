import { BlogPost } from '@/types/blog';

// API Routes'da kullanılacak blog yazıları
const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Scratch ile Kodlama Öğreniyorum",
    description: "Çocuklar için blok tabanlı kodlama platformu Scratch ile programlama öğrenmenin temelleri",
    content: "Scratch, MIT Media Lab tarafından geliştirilen ve çocukların programlama öğrenmesini kolaylaştıran blok tabanlı bir kodlama platformudur...",
    excerpt: "Scratch ile kodlama öğrenmek çocuklar için eğlenceli ve öğretici bir deneyim sunuyor.",
    readingTime: "5 dakika",
    coverImage: "/blog/scratch-coding.jpg",
    tags: ["Eğitim", "Kodlama", "Scratch", "Çocuk Gelişimi"],
    publishedAt: new Date("2024-01-25"),
    author: {
      name: "BT Öğretmeni",
      title: "Bilişim Teknolojileri Öğretmeni",
      image: "/authors/bt-ogretmeni.jpg"
    },
    sources: [
      {
        title: "Scratch Resmi Web Sitesi",
        url: "https://scratch.mit.edu"
      }
    ]
  },
  {
    id: "2", 
    title: "Web Tasarımında Renk Teorisi",
    description: "Web sitesi tasarımında renk seçimi ve renk teorisinin önemi",
    content: "Renk teorisi, web tasarımında kullanıcı deneyimini etkileyen en önemli faktörlerden biridir...",
    excerpt: "Doğru renk seçimleri ile web sitenizi daha etkili hale getirin.",
    readingTime: "7 dakika",
    coverImage: "/blog/color-theory.jpg",
    tags: ["Web Tasarım", "UI/UX", "Renk Teorisi"],
    publishedAt: new Date("2024-01-20"),
    author: {
      name: "Tasarım Uzmanı",
      title: "Senior UI/UX Designer",
      image: "/authors/designer.jpg"
    }
  }
];

export default blogPosts; 