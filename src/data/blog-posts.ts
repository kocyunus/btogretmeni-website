import { BlogPost } from '@/types/blog';

// API Routes'da kullanılacak blog yazıları
const blogPosts: BlogPost[] = [
  {
    "id": "scratch-ile-kodlama", 
    "title": "Scratch ile Çocuklara Kodlama Öğretimi",
    "description": "Scratch kullanarak çocuklara kodlama mantığını nasıl öğretebileceğinizi ve hangi projeleri yapabileceğinizi keşfedin.",
    "content": "Scratch, MIT Media Lab tarafından geliştirilen ve çocuklara kodlama öğretmek için tasarlanmış görsel bir programlama dilidir...",
    "excerpt": "Scratch kullanarak çocuklara kodlama mantığını nasıl öğretebileceğinizi ve hangi projeleri yapabileceğinizi keşfedin.",
    "readingTime": 8,
    "coverImage": "/blog/scratch-coding.jpg",
    "tags": ["Eğitim", "Kodlama", "Scratch", "Çocuk Gelişimi"],
    "publishedAt": "2024-01-25",
    "author": {
      "name": "BT Öğretmeni",
      "title": "Bilişim Teknolojileri Öğretmeni", 
      "avatarUrl": "/images/bt-ogretmeni-logo.png"
    }
  },
  {
    "id": "oyun-tabanli-ogrenme",
    "title": "Oyun Tabanlı Öğrenme: Eğitimde Yeni Bir Yaklaşım",
    "description": "Oyun tabanlı öğrenmenin eğitimdeki önemi ve sınıf içi uygulamaları hakkında detaylı bir rehber.",
    "content": "Oyun tabanlı öğrenme, modern eğitim yaklaşımları arasında giderek daha fazla önem kazanmaktadır...",
    "excerpt": "Oyun tabanlı öğrenmenin eğitimdeki önemi ve sınıf içi uygulamaları hakkında detaylı bir rehber.",
    "readingTime": 10,
    "coverImage": "/blog/game-based-learning.jpg",
    "tags": ["Eğitim", "Oyun Tabanlı Öğrenme", "Pedagoji", "Teknoloji"],
    "publishedAt": "2024-01-20",
    "author": {
      "name": "BT Öğretmeni",
      "title": "Bilişim Teknolojileri Öğretmeni",
      "avatarUrl": "/images/bt-ogretmeni-logo.png"
    }
  }
];

export { blogPosts }; 